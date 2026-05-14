import re
import spacy

nlp = spacy.load("en_core_web_sm")

# Railway-related keywords
railway_keywords = [
    "train",
    "railway",
    "rail",
    "coach",
    "station",
    "platform",
    "irctc",
    "railminindia",
    "railmadad",
    "ticket booking",
    "pnr"
]

# Complaint-related keywords
complaint_keywords = [
    "delay",
    "late",
    "dirty",
    "issue",
    "problem",
    "cancelled",
    "refund",
    "worst",
    "bad",
    "not working",
    "waiting",
    "deducted",
    "complaint"
]


# STEP 1: Check if tweet is railway-related
def is_railway_related(text):

    text = text.lower()

    return any(word in text for word in railway_keywords)


# STEP 2: Check if tweet is actually a complaint
def is_complaint(text):

    text = text.lower()

    return any(word in text for word in complaint_keywords)


# STEP 3: Extract train number
def extract_train(text):

    match = re.search(r'\b\d{5}\b', text)

    return match.group() if match else None


# STEP 4: Extract station/location
def extract_station(text):

    doc = nlp(text)

    for ent in doc.ents:

        # Ignore Twitter mentions
        if ent.label_ == "GPE" and not ent.text.startswith("@"):
            return ent.text

    return None


# STEP 5: Classify complaint type
def classify(text):

    text = text.lower()

    if "delay" in text or "late" in text:
        return "Delay"

    elif "dirty" in text or "clean" in text:
        return "Cleanliness"

    elif "ticket" in text or "refund" in text:
        return "Ticketing"

    elif "cancelled" in text:
        return "Cancellation"

    return "General"