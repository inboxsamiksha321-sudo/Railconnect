import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

labels = [
    # Cleanliness
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
    # Infrastructure
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
    # Electrical
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
    # Safety / Security
    "fight between passengers in train",
    "crowded train coach",
    "passenger harassment in train",
    "suspicious person inside train",
    "unauthorized vendor in train",
    "people blocking train door",
    "passengers sitting near train door",
    "dangerous overcrowding in train",
    "passenger argument in train",
    # Catering
    "stale railway food",
    "dirty pantry area in train",
    "spilled food in train coach",
    "unclean food container in train",
    "dirty food tray in train",
    "poor quality railway meal",
    # Medical
    "passenger fainted in train",
    "injured passenger in train",
    "passenger lying on train floor",
    "medical emergency in train",
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

# Load image
image = Image.open("test.jpg")

# Process inputs
inputs = processor(text=labels, images=image, return_tensors="pt", padding=True)

# Run model
with torch.no_grad():
    outputs = model(**inputs)

# Get probabilities
probs = outputs.logits_per_image.softmax(dim=1)

# Get best match
top_k = 3

top_indices = probs[0].topk(top_k).indices

departments = set()

for idx in top_indices:
    issue = labels[idx]
    dept = department_map.get(issue)
    if dept:
        departments.add(dept)

print("Detected departments:", list(departments))
