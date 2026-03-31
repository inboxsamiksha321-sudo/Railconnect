from fastapi import FastAPI, Form, UploadFile, File
from services.ai_service import predict, predict_image
from services.routing_service import find_current_station, find_next_station
from services.db_service import get_train_id, get_train_route, conn, cursor
import os

app = FastAPI()

@app.get("/")
def home():
    return {"message": "RailConnect API Running"}

@app.post("/submit-complaint")
async def submit_complaint(  # gets complaint INFO
    train_no: str = Form(...),
    user_lat: float = Form(...),
    user_long: float = Form(...),
    text: str = Form(None),
    file: UploadFile = File(None),
):

    departments = set()

    if text:  # calls text classification
        for d in predict(text):
            departments.add(d)

    if file:  # calls image classification
        for d in predict_image(file):
            departments.add(d)

    if not departments:
        departments.add("General")

    train_id = get_train_id(train_no)  # call get_train_id

    if not train_id:
        return {"error": "Invalid train number"}

    route = get_train_route(train_id)  # call get_train_route

    if not route:
        return {"error": "No route found for this train"}

        # call find_current_station
    current_station = find_current_station(route, user_lat, user_long)

    if not current_station:
        return {"error": "Could not determine current station"}

        # call find_next_station
    next_station = find_next_station(route, current_station)
    next_station_id = next_station[0]

    # insert into COMPLAINTS
    cursor.execute(
        """
        INSERT INTO complaints (train_id, complaint_text, user_lat, user_long, assigned_station_id)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING complaint_id;
    """,
        (train_id, text, user_lat, user_long, next_station_id),
    )

    complaint_id = cursor.fetchone()[0]

    # save media file to storage
    if file and file.filename != "":

        # create uploads folder if not exists
        os.makedirs("uploads", exist_ok=True)

        file_path = f"uploads/{complaint_id}_{file.filename}"

        file.file.seek(0)

        with open(file_path, "wb") as f:
            f.write(file.file.read())

            # insert into COMPLAINT_MEDIA
        cursor.execute(
            """
            INSERT INTO complaint_media (complaint_id, media_type, media_url)
            VALUES (%s, %s, %s)
        """,
            (complaint_id, "image", file_path),
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
            INSERT INTO complaint_assignments (complaint_id, station_id, department_id)
            VALUES (%s, %s, %s)
        """,
            (complaint_id, next_station_id, dept_id),
        )

    conn.commit()

    # final response
    return {
        "complaint_id": complaint_id,
        "departments": list(departments),
        "assigned_station_id": next_station_id,
    }
