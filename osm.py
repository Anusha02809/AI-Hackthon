import requests

HEADERS = {
    "User-Agent": "AIHackathonPata/1.0"
}

def get_coordinates(place):

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": place,
        "format": "json",
        "limit": 1
    }

    response = requests.get(
        url,
        params=params,
        headers=HEADERS,
        timeout=10
    )

    data = response.json()

    if len(data) == 0:
        return None

    return float(data[0]["lat"]), float(data[0]["lon"])


def nearby_landmarks(lat, lon):

    overpass_query = f"""
    [out:json];

    (
      node(around:500,{lat},{lon})["name"];
      way(around:500,{lat},{lon})["name"];
      relation(around:500,{lat},{lon})["name"];
    );

    out center;
    """

    response = requests.post(
        "https://overpass-api.de/api/interpreter",
        data=overpass_query,
        headers=HEADERS,
        timeout=30
    )

    return response.json()