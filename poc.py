import openai

openai.api_key = "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"

def load_text(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def save_to_file(responses, output_file):
    with open(output_file, 'w') as file:
        for response in responses:
            file.write(response + '\n')

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
    return response.choices[0]['message']['content'].strip()


def split_into_chunks(text, tokens=3300):
    words = text.split()
    chunks = [' '.join(words[i:i + tokens]) for i in range(0, len(words), tokens)]
    return chunks

def process_chunks(input_file, output_file):
    text = load_text(input_file)
    chunks = split_into_chunks(text)
    responses = [call_openai_api(chunk) for chunk in chunks]
    save_to_file(responses, output_file)

if __name__ == "__main__":
    input_file = "input.txt"
    output_file = "output.txt"
    process_chunks(input_file, output_file)