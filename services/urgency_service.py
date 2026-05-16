def detect_priority(departments):

    if "Medical" in departments:
        return "HIGH"

    if "Safety-Security" in departments:
        return "HIGH"

    if "Electrical" in departments:
        return "MEDIUM"

    if "Infrastructure" in departments:
        return "MEDIUM"

    return "LOW"