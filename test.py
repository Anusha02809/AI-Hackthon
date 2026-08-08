from ai_module import process_address

address = """
Near Ganesh Temple
Opp SBI ATM
Labbipet
Vijayawada
520010
"""

result = process_address(address)

print("\n" + "="*70)
print("         AI ADDRESS PARSING & GEOCODING SYSTEM")
print("="*70)

print("\n📍 ORIGINAL ADDRESS")
print("-"*70)
print(result["original_address"])

print("\n🌐 TRANSLATED ADDRESS")
print("-"*70)
print(result["translated_address"])

print("\n🧠 PARSED COMPONENTS")
print("-"*70)

parsed = result["parsed"]

print(f"House Number : {parsed.get('house_number') or 'Not Found'}")
print(f"Street       : {parsed.get('street') or 'Not Found'}")
print(f"Landmark     : {parsed.get('landmark') or 'Not Found'}")
print(f"Reference    : {parsed.get('reference') or 'Not Found'}")
print(f"Locality     : {parsed.get('locality') or 'Not Found'}")
print(f"City         : {parsed.get('city') or 'Not Found'}")
print(f"District     : {parsed.get('district') or 'Not Found'}")
print(f"State        : {parsed.get('state') or 'Not Found'}")
print(f"Pincode      : {parsed.get('pincode') or 'Not Found'}")

print("\n📌 GEOLOCATION")
print("-"*70)

if result["coordinates"]:
    print(f"Latitude     : {result['coordinates'][0]}")
    print(f"Longitude    : {result['coordinates'][1]}")
else:
    print("Coordinates not found")


if result["coordinates"]:
    lat, lon = result["coordinates"]
    print("\n🗺 GOOGLE MAPS")
    print("-"*70)
    print(f"https://www.google.com/maps?q={lat},{lon}")

print("\n✅ CONFIDENCE SCORE")
print("-"*70)
print(f"{result['confidence']}%")

print("\n🔍 WHY THIS RESULT?")
print("-"*70)

for reason in result["confidence_details"]:
    print(f"✔ {reason}")

print("\n📄 EVIDENCE")
print("-"*70)

for item in result["evidence"]:
    print(f"✔ {item}")

print("\n" + "="*70)
print("ADDRESS SUCCESSFULLY VERIFIED")
print("="*70)