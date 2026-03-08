import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification

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

    for i,p in enumerate(probs):
        if p > threshold:
            results.append(labels[i])

    return results


while True:

    complaint = input("\nEnter complaint: ")

    if complaint == "exit":
        break

    departments = predict(complaint)

    print("Detected Departments:", departments)