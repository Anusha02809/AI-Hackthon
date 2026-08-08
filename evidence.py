def generate_evidence(parsed, pincode_data, landmark):

    evidence=[]

    if landmark:

        evidence.append(
            f"Matched Landmark : {landmark}"
        )

    if pincode_data:

        evidence.append(
            f"Pincode {pincode_data['pincode']} verified"
        )

        evidence.append(
            f"District : {pincode_data['district']}"
        )

        evidence.append(
            f"State : {pincode_data['state']}"
        )

    return evidence