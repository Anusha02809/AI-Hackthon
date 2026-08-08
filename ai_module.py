from parser import parse_address
from translator import translate_to_english
from matcher import validate_pincode
from osm import get_coordinates, nearby_landmarks
from confidence import calculate_confidence
from evidence import generate_evidence

def process_address(address):

    # Step 1
    english = translate_to_english(address)

    # Step 2
    parsed = parse_address(english)

    # Step 3
    pincode_data = validate_pincode(parsed.get("pincode"))

    # Step 4
    landmark_found = False
    coordinates = None

    if parsed.get("city"):

        query = parsed["city"]

        if parsed.get("landmark"):
            query = parsed["landmark"] + " " + query

        coordinates = get_coordinates(query)

        if coordinates:
            landmark_found = True

    # Step 5
    confidence, reasons = calculate_confidence(
        parsed,
        pincode_data,
        landmark_found
    )

    # Step 6
    evidence = generate_evidence(
        parsed,
        pincode_data,
        parsed.get("landmark")
    )

    return {

        "original_address": address,

        "translated_address": english,

        "parsed": parsed,

        "coordinates": coordinates,

        "confidence": confidence,

        "confidence_details": reasons,

        "evidence": evidence
    }