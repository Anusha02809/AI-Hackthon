from osm import get_coordinates, nearby_landmarks

coords = get_coordinates("Kanaka Durga Temple Vijayawada")

print("Coordinates:", coords)

if coords:

    lat, lon = coords

    result = nearby_landmarks(lat, lon)

    elements = result.get("elements", [])

    print("Nearby Landmarks:", len(elements))

    for e in elements[:10]:

        tags = e.get("tags", {})

        print(tags.get("name"))