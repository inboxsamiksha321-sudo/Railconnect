from fastapi import FastAPI, Form, UploadFile, File, Request, Depends, HTTPException, Header
from services.ai_service import predict, predict_image
from services.routing_service import find_current_station, find_next_station
from services.db_service import (
    get_train_id,
    get_train_route,
    get_active_journey,
    get_officer_id,
    conn,
    cursor,
)
from services.urgency_service import detect_priority
from services.auth import hash_password, verify_password, create_access_token
from services.dependencies import get_current_user, get_current_officer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional
from datetime import datetime
from twilio.rest import Client
from supabase import create_client
from jose import jwt
from dotenv import load_dotenv
from deep_translator import GoogleTranslator
from services.twitter_worker import twitter_worker
from services.utility import extract_train_no
import asyncio
import bcrypt
import os
import re

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

current_time = datetime.now()

app = FastAPI()

security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

account_sid = os.getenv("TWILIO_SID")
auth_token = os.getenv("TWILIO_AUTH")

client = Client(account_sid, auth_token)


@app.get("/")
def home():
    return {"message": "RailConnect API Running"}


@app.post("/submit-complaint")
async def submit_complaint(  # gets complaint INFO
    current_user: dict = Depends(get_current_user),
    train_no: str = Form(...),
    user_lat: Optional[float] = Form(None),
    user_long: Optional[float] = Form(None),
    text: str = Form(None),
    files: list[UploadFile] = File([]),
):

    print(current_user)


    departments = set()

    translated_text = text

    try:
        translated_text = GoogleTranslator(
            source='auto',
            target='en'
        ).translate(text)

        print("Original:", text)
        print("Translated:", translated_text)

    except Exception as e:
        print("Translation failed:", e)

    if translated_text:
        for d in predict(translated_text):
            departments.add(d)

    file_bytes = None

    if not departments:
        departments.add("General")

    priority = detect_priority(departments)

    print("#1")

    train_id = get_train_id(train_no)  # call get_train_id

    if not train_id:
        raise HTTPException(status_code=400, detail="Invalid train number")
    print("Train ID:", train_id)

    print("#2")

    journey = get_active_journey(train_id, current_time)

    print("#3")

    if journey:
        route_id = journey["route_id"]
    else:
        cursor.execute("""
            SELECT route_id
            FROM journeys
            WHERE train_id = %s
            LIMIT 1
        """, (train_id,))

        result = cursor.fetchone()

        if not result:
            raise HTTPException(
                status_code=400,
                detail="No journey found for this train"
            )

        route_id = result[0]
        
    print("Route ID:", route_id)
    
    print("4")

    route = get_train_route(route_id)  # call get_train_route

    if not route:
        return {"error": "No route found for this train"}
    print("Route:", route)

    print("User Location:", user_lat, user_long)

    if (
        user_lat is None or user_long is None
    ):  # if no location shared, route to the last station
        last_station = route[-1]
        next_station_id = last_station[0]

    else:  # call find_current_station
        current_station = find_current_station(route, user_lat, user_long)

        if not current_station:
            return {"error": "Could not determine current station"}
        print("Current Station:", current_station)

        # call find_next_station
        next_station = find_next_station(route, current_station)
        next_station_id = next_station[0]

        print("Next Station:", next_station)
        print("Assigned Station ID:", next_station_id)

    # insert into COMPLAINTS
    cursor.execute(
        """
        INSERT INTO complaints (user_id, train_id, complaint_text, user_lat, user_long, assigned_station_id, priority)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING complaint_id;
    """,
        (
            current_user["user_id"],
            train_id,
            text,
            user_lat,
            user_long,
            next_station_id,
            priority,
        ),
    )

    complaint_id = cursor.fetchone()[0]

    # SAVE MULTIPLE MEDIA FILES

    for file in files:

        if not file.filename:
            continue

        content_type = file.content_type

        if "image" in content_type:
            media_type = "image"

        elif "audio" in content_type:
            media_type = "audio"

        elif "video" in content_type:
            media_type = "video"

        else:
            media_type = "other"

        file_bytes = await file.read()

        # IMAGE AI DETECTION
        if "image" in content_type:

            for d in predict_image(file_bytes):
                departments.add(d)

        file.file.seek(0)

        file_name = f"{complaint_id}_{file.filename}"

        supabase.storage.from_("complaint-media").upload(
            file_name,
            file_bytes
        )

        file_url = supabase.storage.from_("complaint-media").get_public_url(
            file_name
        )

        cursor.execute(
            """
            INSERT INTO complaint_media (
                complaint_id,
                media_type,
                media_url
            )
            VALUES (%s, %s, %s)
            """,
            (
                complaint_id,
                media_type,
                file_url
            ),
        )

        # insert into COMPLAINT_DEPARTMENTS
    for dept in departments:
        cursor.execute(
            """
            SELECT department_id FROM departments WHERE department_name = %s
        """,
            (dept,),
        )

        result = cursor.fetchone()

        if not result:
            continue

        dept_id = result[0]

        officer_id = get_officer_id(next_station_id, dept_id)

        cursor.execute(
            """
            INSERT INTO complaint_departments (complaint_id, department_id)
            VALUES (%s, %s)
        """,
            (complaint_id, dept_id),
        )

        # insert into COMPLAINT_ASSIGNMENTS
        cursor.execute(
            """
            INSERT INTO complaint_assignments (complaint_id, station_id, department_id, officer_id)
            VALUES (%s, %s, %s, %s)
        """,
            (complaint_id, next_station_id, dept_id, officer_id),
        )

    conn.commit()

    print("COMPLAINT SAVED SUCCESSFULLY")

    print("Complaint stored:", complaint_id)

    # final response
    return {
        "complaint_id": complaint_id,
        "departments": list(departments),
        "assigned_station_id": next_station_id,
        "priority": priority,
    }


@app.post("/whatsapp")
async def whatsapp_webhook(request: Request):

    form = await request.form()

    text = form.get("Body")
    sender = form.get("From")

    print("Message:", text)
    print("Sender:", sender)

    departments = set()

    # ---- TEXT PREDICTION ----
    if text:
        for d in predict(text):
            departments.add(d)

    if not departments:
        departments.add("General")

    priority = detect_priority(departments)

    # ---- TEMP TRAIN ----
    train_no = extract_train_no(text)

    if not train_no:
        client.messages.create(
            from_="whatsapp:+14155238886",
            body="❌ Please include train number.\nExample: 12127 AC not working",
            to=sender,
        )
        print("error : Please include train number in message")
        return {"error": "Please include train number in message"}

    print("Train No:", train_no)

    train_id = get_train_id(train_no)

    if not train_id:
        client.messages.create(
            from_="whatsapp:+14155238886",
            body="No train id found for this train no. INVALID train no.",
            to=sender,
        )
        print("No train id found for this train no. INVALID train no.")
        return {"error": "Invalid train number"}
    print("Train ID:", train_id)

    current_time = datetime.now()

    journey = get_active_journey(train_id, current_time)

    if not journey:
        client.messages.create(
            from_="whatsapp:+14155238886",
            body="The train is not currently running",
            to=sender,
        )
        print("error Train not running")
        return {"error": "Train not running"}

    print("Journey:", journey)

    route_id = journey["route_id"]
    print("Route ID:", route_id)

    route = get_train_route(route_id)

    if not route:
        client.messages.create(
            from_="whatsapp:+14155238886",
            body="no route found for this train",
            to=sender,
        )
        print("no route found for this train")
        return {"error": "No route found"}

    print("Route:", route)

    # ---- NO LOCATION → LAST STATION ----
    last_station = route[-1]
    next_station_id = last_station[0]
    
    cursor.execute(
        """
        SELECT station_name
        FROM stations
        WHERE station_id = %s
        """,
        (next_station_id,)
    )

    station_result = cursor.fetchone()

    station_name = (
        station_result[0]
        if station_result
        else "Unknown Station"
    )

    # ---- INSERT COMPLAINT ----
    cursor.execute(
        """
        INSERT INTO complaints (train_id, complaint_text, assigned_station_id, priority, whatsapp_number)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING complaint_id;
        """,
        (train_id, text, next_station_id, priority, sender),
    )

    complaint_id = cursor.fetchone()[0]

    # ---- INSERT DEPARTMENTS ----
    for dept in departments:

        cursor.execute(
            """
            SELECT department_id FROM departments WHERE department_name = %s
            """,
            (dept,),
        )

        result = cursor.fetchone()

        if not result:
            continue

        dept_id = result[0]

        officer_id = get_officer_id(next_station_id, dept_id)
        
        cursor.execute(
            """
            SELECT name, email
            FROM officers
            WHERE officer_id = %s
            """,
            (officer_id,)
        )

        officer_result = cursor.fetchone()

        if officer_result:

            officer_name = officer_result[0]
            officer_email = officer_result[1]

        else:

            officer_name = "Officer Not Assigned"
            officer_email = "N/A"

        cursor.execute(
            """
            INSERT INTO complaint_departments (complaint_id, department_id)
            VALUES (%s, %s)
            """,
            (complaint_id, dept_id),
        )

        cursor.execute(
            """
            INSERT INTO complaint_assignments (complaint_id, station_id, department_id, officer_id)
            VALUES (%s, %s, %s, %s)
            """,
            (complaint_id, next_station_id, dept_id, officer_id),
        )

    conn.commit()

    print("Complaint stored:", complaint_id)

    client.messages.create(
        from_="whatsapp:+14155238886",
        body=(
            f"Complaint Registered Successfully!\n\n"
            f"Complaint ID: {complaint_id}\n"
            f"Department: {dept}\n"
            f"Assigned Station: {station_name}\n"
            f"Assigned Officer: {officer_name}\n"
            f"Officer Email: {officer_email}\n\n"
            f"Our team will take action shortly."
        ),
        to=sender,
    )

    return {
        "complaint_id": complaint_id,
        "departments": list(departments),
        "assigned_station_id": next_station_id,
        "priority": priority,
    }


@app.post("/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    password: str = Form(...),
):

    # check existing email
    existing_email = supabase.table("users").select("*").eq("email", email).execute()

    if existing_email.data:
        return {"success": False, "message": "Email already registered"}

    # check existing phone
    existing_phone = supabase.table("users").select("*").eq("phone", phone).execute()

    if existing_phone.data:
        return {"success": False, "message": "Phone number already registered"}

    # hash password
    hashed_password = hash_password(password)

    # insert user
    response = (
        supabase.table("users")
        .insert(
            {
                "name": name,
                "email": email,
                "phone": phone,
                "password": hashed_password,
                "role": "passenger",
            }
        )
        .execute()
    )

    user = response.data[0]

    # create JWT token
    token = create_access_token(
        {"user_id": user["id"], "email": user["email"], "role": user["role"]}
    )

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "role": user["role"],
        },
    }


@app.post("/login")
async def login(email: str = Form(...), password: str = Form(...)):

    # find user by email
    response = supabase.table("users").select("*").eq("email", email).execute()

    # user not found
    if not response.data:
        return {"success": False, "message": "Invalid email or password"}

    user = response.data[0]

    # verify password
    if not verify_password(password, user["password"]):
        return {"success": False, "message": "Invalid email or password"}

    # create JWT token
    token = create_access_token(
        {"user_id": user["id"], "email": user["email"], "role": user["role"]}
    )

    return {
        "success": True,
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "role": user["role"],
        },
    }


@app.get("/my-complaints")
async def my_complaints(
    current_user: dict = Depends(get_current_user)
):

    try:

        print("CURRENT USER:", current_user)

        cursor.execute(
            """
            SELECT *
            FROM complaints
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (current_user["user_id"],)
        )

        complaints = cursor.fetchall()

        formatted = []

        for c in complaints:
            formatted.append({
                "complaint_id": c[0],
                "train_id": c[1],
                "complaint_text": c[2],
                "user_lat": c[3],
                "user_long": c[4],
                "assigned_station_id": c[5],
                "status": c[6],
                "created_at": str(c[7]),
                "priority": c[8]
            })

        return formatted

    except Exception as e:

        print("ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
 
        

@app.get("/complaint/{complaint_id}")
async def get_complaint_details(
    complaint_id: int,
    current_user: dict = Depends(get_current_user)
):

    cursor.execute(
        """
        SELECT c.*, t.train_no
        FROM complaints c
        JOIN trains t
        ON c.train_id = t.train_id
        WHERE c.complaint_id = %s
        AND c.user_id = %s
        """,
        (complaint_id, current_user["user_id"])
    )

    complaint = cursor.fetchone()
    
    cursor.execute(
        """
        SELECT d.department_name
        FROM complaint_departments cd
        JOIN departments d
        ON cd.department_id = d.department_id
        WHERE cd.complaint_id = %s
        LIMIT 1
        """,
        (complaint_id,)
    )

    dept_result = cursor.fetchone()

    department = (
        dept_result[0]
        if dept_result
        else "General"
    )
    
    cursor.execute(
        """
        SELECT route_id
        FROM journeys
        WHERE train_id = %s
        LIMIT 1
        """,
        (complaint[1],)
    )

    journey_result = cursor.fetchone()

    source_station = "Unknown"
    destination_station = "Unknown"

    if journey_result:

        route_id = journey_result[0]

        cursor.execute(
            """
            SELECT s.station_name
            FROM train_routes r
            JOIN stations s
            ON r.station_id = s.station_id
            WHERE r.route_id = %s
            ORDER BY r.stop_number ASC
            """,
            (route_id,)
        )

        stations = cursor.fetchall()

        if stations and len(stations) >= 2:

            source_station = stations[0][0]
            destination_station = stations[-1][0]
            
    cursor.execute(
        """
        SELECT media_type, media_url
        FROM complaint_media
        WHERE complaint_id = %s
        """,
        (complaint_id,)
    )

    media_results = cursor.fetchall()

    media = []

    for m in media_results:
        media.append({
            "media_type": m[0],
            "media_url": m[1]
        })

    if not complaint:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    formatted = {

        "complaint_id": complaint[0],
        "train_no": complaint[12],
        "source_station": source_station,
        "destination_station": destination_station,
        "complaint_text": complaint[2],
        "media": media,
        "user_lat": complaint[3],
        "user_long": complaint[4],
        "assigned_station_id": complaint[5],
        "status": complaint[6],
        "created_at": str(complaint[7]),
        "priority": complaint[8],
        "remarks": complaint[11],
        "department": department
    }

    return formatted


@app.post("/officer-login")
async def officer_login(

    email: str = Form(...),
    password: str = Form(...)

):

    cursor.execute(
        """
        SELECT *
        FROM officers
        WHERE email = %s
        """,
        (email,)
    )

    officer = cursor.fetchone()
    
    print(officer)

    if not officer:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    stored_password = officer[6]

    password_match = bcrypt.checkpw(
        password.encode(),
        stored_password.encode()
    )

    if not password_match:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = jwt.encode(

        {
            "officer_id": officer[0],
            "email": officer[2],
            "role": "officer"
        },

        SECRET_KEY,

        algorithm="HS256"
    )

    return {

        "success": True,

        "token": token,

        "officer": {

            "officer_id": officer[0],
            "name": officer[1],
            "email": officer[2],
            "station_id": officer[3],
            "department_id": officer[4],
            "role": "officer"
        }
    }
    
    

@app.get("/officer-complaints")
async def get_officer_complaints(

    current_officer: dict = Depends(get_current_officer)

):

    officer_id = current_officer["officer_id"]

    cursor.execute(
        """
        SELECT
            c.complaint_id,
            c.complaint_text,
            c.status,
            c.priority,
            c.created_at,
            t.train_no

        FROM complaint_assignments ca

        JOIN complaints c
        ON ca.complaint_id = c.complaint_id

        JOIN trains t
        ON c.train_id = t.train_id

        WHERE ca.officer_id = %s

        ORDER BY c.created_at DESC
        """,
        (officer_id,)
    )

    complaints = cursor.fetchall()

    formatted = []

    for c in complaints:

        formatted.append({

            "complaint_id": c[0],

            "complaint_text": c[1],

            "status": c[2],

            "priority": c[3],

            "created_at": str(c[4]),

            "train_no": c[5]
        })

    return formatted


@app.get("/officer-complaint/{complaint_id}")
async def get_officer_complaint(
    complaint_id: int,
    current_officer: dict = Depends(get_current_officer)
):

    cursor.execute(
        """
        SELECT
            c.complaint_id,
            c.complaint_text,
            c.status,
            c.priority,
            c.created_at,
            t.train_no,
            u.email,
            c.whatsapp_number,
            c.tweet_url,
            c.twitter_username
        FROM complaints c

        JOIN trains t
        ON c.train_id = t.train_id
        
        LEFT JOIN users u
        ON c.user_id = u.id

        JOIN complaint_assignments ca
        ON c.complaint_id = ca.complaint_id

        WHERE c.complaint_id = %s
        AND ca.officer_id = %s
        """,
        (
            complaint_id,
            current_officer["officer_id"]
        )
    )

    complaint = cursor.fetchone()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )
        
    cursor.execute(
        """
        SELECT d.department_name
        FROM complaint_departments cd

        JOIN departments d
        ON cd.department_id = d.department_id

        WHERE cd.complaint_id = %s

        LIMIT 1
        """,
        (complaint_id,)
    )

    dept_result = cursor.fetchone()

    department = (
        dept_result[0]
        if dept_result
        else "General"
    )
    
    
    cursor.execute(
        """
        SELECT route_id
        FROM journeys
        WHERE train_id = (
            SELECT train_id
            FROM complaints
            WHERE complaint_id = %s
        )
        LIMIT 1
        """,
        (complaint_id,)
    )

    journey_result = cursor.fetchone()

    source_station = "Unknown"
    destination_station = "Unknown"

    if journey_result:

        route_id = journey_result[0]

        cursor.execute(
            """
            SELECT s.station_name
            FROM train_routes r

            JOIN stations s
            ON r.station_id = s.station_id

            WHERE r.route_id = %s

            ORDER BY r.stop_number ASC
            """,
            (route_id,)
        )

        stations = cursor.fetchall()

        if stations and len(stations) >= 2:

            source_station = stations[0][0]
            destination_station = stations[-1][0]

    cursor.execute(
        """
        SELECT media_type, media_url
        FROM complaint_media
        WHERE complaint_id = %s
        """,
        (complaint_id,)
    )

    media_results = cursor.fetchall()

    media = []

    for m in media_results:
        media.append({
            "media_type": m[0],
            "media_url": m[1]
        })

    return {
        "complaint_id": complaint[0],
        "complaint_text": complaint[1],
        "status": complaint[2],
        "priority": complaint[3],
        "created_at": str(complaint[4]),
        "train_no": complaint[5],
        "passenger_email": complaint[6],
        "whatsapp_number": complaint[7],
        "tweet_url": complaint[8],
        "twitter_username": complaint[9],
        "department": department,
        "source_station": source_station,
        "destination_station": destination_station,
        "media": media
    }
    
    
@app.put("/update-complaint-status/{complaint_id}")
async def update_complaint_status(
    complaint_id: int,
    status: str = Form(...),
    remarks: str = Form(""),
    current_officer: dict = Depends(get_current_officer)
):

    cursor.execute(
        """
        SELECT *
        FROM complaint_assignments
        WHERE complaint_id = %s
        AND officer_id = %s
        """,
        (
            complaint_id,
            current_officer["officer_id"]
        )
    )

    assignment = cursor.fetchone()

    if not assignment:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )
        
    cursor.execute(
        """
        SELECT whatsapp_number
        FROM complaints
        WHERE complaint_id = %s
        """,
        (complaint_id,)
    )

    whatsapp_result = cursor.fetchone()

    whatsapp_number = (
        whatsapp_result[0]
        if whatsapp_result
        else None
    )
    
    cursor.execute(
        """
        UPDATE complaints
        SET status = %s,
            remarks = %s
        WHERE complaint_id = %s
        """,
        (
            status,
            remarks,
            complaint_id
        )
    )

    conn.commit()
    
    if whatsapp_number:

        client.messages.create(
            from_="whatsapp:+14155238886",

            body=(
                f"Complaint Update\n\n"
                f"Complaint ID: {complaint_id}\n"
                f"Status: {status.upper()}\n\n"
                f"Officer Remarks:\n"
                f"{remarks}"
            ),
            to=whatsapp_number,
        )

    return {
        "success": True,
        "message": "Complaint updated successfully"
    }
    
    
@app.on_event("startup")
async def start_twitter_worker():

    print("Starting Twitter Worker....")

    asyncio.create_task(
        twitter_worker()
    )