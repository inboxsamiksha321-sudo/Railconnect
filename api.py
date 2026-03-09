import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Load trained model
model = DistilBertForSequenceClassification.from_pretrained("railway_complaint_model")
tokenizer = DistilBertTokenizer.from_pretrained("railway_complaint_model")

model.eval()

labels = [
    "Cleanliness",
    "Electrical",
    "Infrastructure",
    "Safety-Security",
    "Staff",
    "Catering",
    "Medical",
    "General"
]

# Request format
class Complaint(BaseModel):
    text: str


def predict(text):

    text = text.lower().strip()

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

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

    return {
        "complaint": data.text,
        "departments": departments
    }