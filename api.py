import torch
import math
import os
from db import conn, cursor
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from fastapi import FastAPI
from fastapi import Form
from pydantic import BaseModel
from fastapi import UploadFile, File
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

app = FastAPI()

# Load trained model
model = DistilBertForSequenceClassification.from_pretrained("railway_complaint_model")
tokenizer = DistilBertTokenizer.from_pretrained("railway_complaint_model")

model.eval()

# Load CLIP model for image classification
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

image_labels = [
    "dirty railway toilet",
    "garbage inside train coach",
    "trash on train floor",
    "dirty train washroom",
    "unclean railway compartment",
    "insects in train coach",
    "cockroaches in train toilet",
    "overflowing garbage bin in train",
    "dirty train corridor",
    "water spilled on train floor",
    "broken train seat",
    "damaged train seat cushion",
    "torn train seat cover",
    "broken train window",
    "cracked train window glass",
    "damaged train door",
    "train door not closing properly",
    "broken luggage rack in train",
    "damaged train coach interior",
    "loose train handrail",
    "sparking electric socket in train",
    "train charging socket not working",
    "broken charging port in train",
    "train lights not working",
    "train coach light flickering",
    "train AC not working",
    "AC leaking water in train",
    "train fan not working",
    "electric panel open in train",
    "burnt electrical wiring in train",
    "fight between passengers in train",
    "crowded train coach",
    "passenger harassment in train",
    "suspicious person inside train",
    "unauthorized vendor in train",
    "people blocking train door",
    "passengers sitting near train door",
    "dangerous overcrowding in train",
    "passenger argument in train",
    "stale railway food",
    "dirty pantry area in train",
    "spilled food in train coach",
    "unclean food container in train",
    "dirty food tray in train",
    "poor quality railway meal",
    "passenger fainted in train",
    "injured passenger in train",
    "passenger lying on train floor",
    "medical emergency in train",
]

labels = [
    "Cleanliness",
    "Electrical",
    "Infrastructure",
    "Safety-Security",
    "Staff",
    "Catering",
    "Medical",
    "General",
]

department_map = {
    # Cleanliness
    "dirty railway toilet": "Cleanliness",
    "garbage inside train coach": "Cleanliness",
    "trash on train floor": "Cleanliness",
    "dirty train washroom": "Cleanliness",
    "unclean railway compartment": "Cleanliness",
    "insects in train coach": "Cleanliness",
    "cockroaches in train toilet": "Cleanliness",
    "overflowing garbage bin in train": "Cleanliness",
    "dirty train corridor": "Cleanliness",
    "water spilled on train floor": "Cleanliness",
    # Infrastructure
    "broken train seat": "Infrastructure",
    "damaged train seat cushion": "Infrastructure",
    "torn train seat cover": "Infrastructure",
    "broken train window": "Infrastructure",
    "cracked train window glass": "Infrastructure",
    "damaged train door": "Infrastructure",
    "train door not closing properly": "Infrastructure",
    "broken luggage rack in train": "Infrastructure",
    "damaged train coach interior": "Infrastructure",
    "loose train handrail": "Infrastructure",
    # Electrical
    "sparking electric socket in train": "Electrical",
    "train charging socket not working": "Electrical",
    "broken charging port in train": "Electrical",
    "train lights not working": "Electrical",
    "train coach light flickering": "Electrical",
    "train AC not working": "Electrical",
    "AC leaking water in train": "Electrical",
    "train fan not working": "Electrical",
    "electric panel open in train": "Electrical",
    "burnt electrical wiring in train": "Electrical",
    # Safety-Security
    "fight between passengers in train": "Safety-Security",
    "crowded train coach": "Safety-Security",
    "passenger harassment in train": "Safety-Security",
    "suspicious person inside train": "Safety-Security",
    "unauthorized vendor in train": "Safety-Security",
    "people blocking train door": "Safety-Security",
    "passengers sitting near train door": "Safety-Security",
    "dangerous overcrowding in train": "Safety-Security",
    "passenger argument in train": "Safety-Security",
    # Catering
    "stale railway food": "Catering",
    "dirty pantry area in train": "Catering",
    "spilled food in train coach": "Catering",
    "unclean food container in train": "Catering",
    "dirty food tray in train": "Catering",
    "poor quality railway meal": "Catering",
    # Medical
    "passenger fainted in train": "Medical",
    "injured passenger in train": "Medical",
    "passenger lying on train floor": "Medical",
    "medical emergency in train": "Medical",
}


# Request format
class Complaint(BaseModel):
    text: str


# Get train_id from train_no
def get_train_id(train_no):
    cursor.execute(
        """
        SELECT train_id FROM trains WHERE train_no = %s
    """,
        (train_no,),
    )

    result = cursor.fetchone()
    return result[0] if result else None


# Get route of train
def get_train_route(train_id):
    cursor.execute(
        """
        SELECT tr.station_id, tr.stop_number, s.latitude, s.longitude
        FROM train_routes tr
        JOIN stations s ON tr.station_id = s.station_id
        WHERE tr.train_id = %s
        ORDER BY tr.stop_number
    """,
        (train_id,),
    )

    return cursor.fetchall()


# Distance (simple)
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))

    return R * c


# Find current station
def find_current_station(route, user_lat, user_long):
    min_dist = float("inf")
    current = None

    for station in route:
        station_id, stop_no, lat, lon = station
        dist = calculate_distance(user_lat, user_long, lat, lon)

        if dist < min_dist:
            min_dist = dist
            current = station

    return current


# Find next station
def find_next_station(route, current_station):
    current_stop = current_station[1]

    for station in route:
        if station[1] == current_stop + 1:
            return station

    return current_station  # last station case


def predict(text):

    text = text.lower().strip()

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.sigmoid(outputs.logits)[0]

    threshold = 0.25

    results = []

    for i, p in enumerate(probs):
        if p > threshold:
            results.append(labels[i])

    return results


# Root endpoint
@app.get("/")
def home():
    return {"message": "RailConnect AI Complaint API Running"}


# Prediction endpoint
@app.post("/predict")
def predict_complaint(data: Complaint):

    departments = predict(data.text)

    return {"complaint": data.text, "departments": departments}


@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):

    image = Image.open(file.file)

    inputs = clip_processor(
        text=image_labels, images=image, return_tensors="pt", padding=True
    )

    with torch.no_grad():
        outputs = clip_model(**inputs)

    probs = outputs.logits_per_image.softmax(dim=1)

    top_k = 3
    top_indices = probs[0].topk(top_k).indices

    departments = set()

    for idx in top_indices:
        issue = image_labels[idx]
        dept = department_map.get(issue)

        if dept:
            departments.add(dept)

    return {"departments": list(departments)}


@app.post("/submit-complaint")
async def submit_complaint(
    train_no: str = Form(...),
    user_lat: float = Form(...),
    user_long: float = Form(...),
    text: str = Form(None),
    file: UploadFile = File(None),
):

    departments = set()

    # ---- TEXT ----
    if text:
        for d in predict(text):
            departments.add(d)

    # ---- IMAGE ----
    if file:
        image = Image.open(file.file)

        inputs = clip_processor(
            text=image_labels, images=image, return_tensors="pt", padding=True
        )

        with torch.no_grad():
            outputs = clip_model(**inputs)

        probs = outputs.logits_per_image.softmax(dim=1)
        top_indices = probs[0].topk(3).indices

        for idx in top_indices:
            issue = image_labels[idx]
            dept = department_map.get(issue)
            if dept:
                departments.add(dept)

    # ❗ FIX 1: Ensure at least one department
    if not departments:
        departments.add("General")

    # ---- TRAIN ROUTING ----
    train_id = get_train_id(train_no)

    if not train_id:
        return {"error": "Invalid train number"}

    route = get_train_route(train_id)

    # ❗ FIX 2: Handle empty route
    if not route:
        return {"error": "No route found for this train"}

    current_station = find_current_station(route, user_lat, user_long)

    # ❗ FIX 3: Safety check
    if not current_station:
        return {"error": "Could not determine current station"}

    next_station = find_next_station(route, current_station)
    next_station_id = next_station[0]

    # ---- INSERT COMPLAINT ----
    cursor.execute(
        """
        INSERT INTO complaints (train_id, complaint_text, user_lat, user_long, assigned_station_id)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING complaint_id;
    """,
        (train_id, text, user_lat, user_long, next_station_id),
    )

    complaint_id = cursor.fetchone()[0]

    # ---- SAVE IMAGE ----

    if file and file.filename != "":

        # create uploads folder if not exists
        os.makedirs("uploads", exist_ok=True)

        file_path = f"uploads/{complaint_id}_{file.filename}"

        file.file.seek(0)

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        # insert into DB
        cursor.execute(
            """
            INSERT INTO complaint_media (complaint_id, media_type, media_url)
            VALUES (%s, %s, %s)
        """,
            (complaint_id, "image", file_path),
        )

    # ---- INSERT DEPARTMENTS ----
    for dept in departments:
        cursor.execute(
            """
            SELECT department_id FROM departments WHERE department_name = %s
        """,
            (dept,),
        )

        result = cursor.fetchone()

        # ❗ FIX 4: Avoid crash if department not found
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

        cursor.execute(
            """
            INSERT INTO complaint_assignments (complaint_id, station_id, department_id)
            VALUES (%s, %s, %s)
        """,
            (complaint_id, next_station_id, dept_id),
        )

    conn.commit()

    return {
        "complaint_id": complaint_id,
        "departments": list(departments),
        "assigned_station_id": next_station_id,
    }
