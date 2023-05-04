import openai

openai.api_key = "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"

chunk = "small.txt"

def call_openai_api(chunk):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a language processor that helps the user summarize the main point of a text input."},
            {"role": "user", "content": f"What is this text about in one sentence? Here it is: {chunk}."},
        ],
        max_tokens=50,
        n=1,
        stop=None,
        temperature=0.5,
    )
    print(response)
    return response

with open("small.txt", "r") as file:
    chunk = file.read()

response = call_openai_api(chunk)


