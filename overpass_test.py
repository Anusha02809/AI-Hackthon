from parser import parse_address
from osm import search_landmarks

address = """
Near Kanaka Durga Temple
Vijayawada
"""

parsed = parse_address(address)

print(parsed)

result = search_landmarks(
    city=parsed["city"],
    landmark=parsed["landmark"],
    locality=parsed["locality"]
)

print(result)