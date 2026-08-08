from rapidfuzz import fuzz

def calculate_confidence(parsed, pincode_data, landmark_found):

    score = 0

    details = []

    # Landmark found
    if landmark_found:
        score += 40
        details.append("Landmark verified via OpenStreetMap")

    # Pincode
    if pincode_data:
        score += 30
        details.append("Valid pincode")

        # District
        if parsed.get("district"):

            if parsed["district"].lower() == pincode_data["district"].lower():

                score += 10
                details.append("District matched")

        # State
        if parsed.get("state"):

            if parsed["state"].lower() == pincode_data["state"].lower():

                score += 10
                details.append("State matched")

    # City
    if parsed.get("city") and pincode_data:

        similarity = fuzz.ratio(
            parsed["city"],
            pincode_data["district"]
        )

        if similarity > 70:

            score += 10
            details.append("City similarity")

    return min(score,100), details