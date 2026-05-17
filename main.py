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
from services.dependencies import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional
from datetime import datetime
from twilio.rest import Client
from supabase import create_client
from jose import jwt
from dotenv import load_dotenv
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
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

account_sid = os.getenv("TWILIO_SID")
auth_token = os.getenv("TWILIO_AUTH")

client = Client(account_sid, auth_token)


def extract_train_no(text):
    match = re.search(r"\b\d{5}\b", text)
    return match.group() if match else None


@app.get("/")
def home():
    return {"message": "RailConnect API Running"}


@app.post("/submit-complaint")
async def submit_complaint(  # gets complaint INFO
    credentials: HTTPAuthorizationCredentials = Depends(security),
    train_no: str = Form(...),
    user_lat: Optional[float] = Form(None),
    user_long: Optional[float] = Form(None),
    text: str = Form(None),
    file: UploadFile = File(None),
):

    token = credentials.credentials

    current_user = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=["HS256"]
    )

    print(current_user)

    if file:
        content_type = file.content_type
    else:
        content_type = "none"

    if "image" in content_type:
        media_type = "image"
    elif "audio" in content_type:
        media_type = "audio"
    elif "video" in content_type:
        media_type = "video"
    else:
        media_type = "other"

    departments = set()

    if text:  # calls text classification
        for d in predict(text):
            departments.add(d)

    if file and "image" in file.content_type:  # calls image classification
        for d in predict_image(file):
            departments.add(d)

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

    # save media file to storage
    if file and file.filename != "":

        file_bytes = await file.read()

        file_name = f"{complaint_id}_{file.filename}"

        supabase.storage.from_("complaint-media").upload(file_name, file_bytes)

        file_url = supabase.storage.from_("complaint-media").get_public_url(file_name)

        # insert into COMPLAINT_MEDIA
        cursor.execute(
            """
            INSERT INTO complaint_media (complaint_id, media_type, media_url)
            VALUES (%s, %s, %s)
        """,
            (complaint_id, media_type, file_url),
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

    # ---- INSERT COMPLAINT ----
    cursor.execute(
        """
        INSERT INTO complaints (train_id, complaint_text, assigned_station_id, priority)
        VALUES (%s, %s, %s, %s)
        RETURNING complaint_id;
        """,
        (train_id, text, next_station_id, priority),
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
        body=f"✅ Complaint registered successfully!\nComplaint ID: {complaint_id}",
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
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    try:

        token = credentials.credentials

        print("TOKEN:", token)

        current_user = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

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

        print("COMPLAINTS:", complaints)

        return complaints

    except Exception as e:

        print("ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )