import os
import pandas as pd
from rapidfuzz import process

# Get the absolute path of this file
current_dir = os.path.dirname(os.path.abspath(__file__))

# Build path to ../data/pincode.csv
csv_path = os.path.join(current_dir, "..", "data", "pincode.csv")

# Load CSV
data = pd.read_csv(csv_path)

# Print available columns once
#print("Available columns:", data.columns.tolist())

# Automatically detect locality column
possible_locality_cols = [
    "OfficeName",
    "Office Name",
    "officename",
    "office_name",
    "Name"
]

locality_col = None
for col in possible_locality_cols:
    if col in data.columns:
        locality_col = col
        break

if locality_col is None:
    raise Exception(f"Could not find locality column. Found: {data.columns.tolist()}")

# Get unique locality names
localities = data[locality_col].dropna().astype(str).unique()


def match_locality(locality):
    """
    Fuzzy match a locality name against the pincode dataset
    """

    if locality is None or locality.strip() == "":
        return {
            "matched": None,
            "score": 0
        }

    match = process.extractOne(locality, localities)

    return {
        "input": locality,
        "matched": match[0],
        "score": round(match[1], 2)
    }


def validate_pincode(pincode):

    if not pincode:
        return None

    try:
        pincode = int(str(pincode))

        rows = data[data["pincode"] == pincode]

        if rows.empty:
            return None

        row = rows.iloc[0]      # <-- First matching record

        return {
            "circlename": row["circlename"],
            "regionname": row["regionname"],
            "divisionname": row["divisionname"],
            "officename": row["officename"],
            "pincode": int(row["pincode"]),
            "district": row["district"],
            "state": row["statename"],
            "latitude": float(row["latitude"]),
            "longitude": float(row["longitude"])
        }

    except Exception as e:
        print(e)
        return None


# Test block
if __name__ == "__main__":
    print(match_locality("Labbipett"))
    print(validate_pincode("520010"))