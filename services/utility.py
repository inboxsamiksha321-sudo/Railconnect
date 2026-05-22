import re

def extract_train_no(text):

    match = re.search(r"\b\d{5}\b", text)

    return match.group() if match else None