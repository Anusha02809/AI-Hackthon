import json
from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """
You are an expert in parsing Indian postal addresses.

Convert the user's address into STRICT JSON.

Rules:

Return ONLY JSON.

Fields:

{
"house_number":"",
"street":"",
"landmark":"",
"reference":"",
"locality":"",
"city":"",
"district":"",
"state":"",
"pincode":""
}

If a field is missing return null.

Understand:

- Hinglish
- Telugu
- Hindi
- Mixed languages
- Landmark-based addresses

Do not explain.

Return JSON only.
"""

def parse_address(address):

    completion = client.chat.completions.create(

        model="llama-3.1-8b-instant",

        temperature=0,

        messages=[
            {
                "role":"system",
                "content":SYSTEM_PROMPT
            },

            {
                "role":"user",
                "content":address
            }
        ]

    )

    reply = completion.choices[0].message.content

    try:

        return json.loads(reply)

    except:

        print("LLM Output")

        print(reply)

        return None