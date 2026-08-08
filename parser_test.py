from parser import parse_address

address = """
Near Ganesh Temple

Opp SBI ATM

Labbipet

Vijayawada

520010
"""

result = parse_address(address)

print(result)