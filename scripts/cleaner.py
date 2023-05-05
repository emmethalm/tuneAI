import openai

openai.api_key = "sk-XXXXXXXXXXXXXXXXXX"

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
            {"role": "system", "content": "You are an assistant that cleans transcripts for grammatical mistakes, punctuation, and filler words. You are given a transcript between figures. You must edit the transcript for grammatical correctness, add correct punctuation, identify the speakers, remove filler words like 'um' and 'like', and return it to the user. Use context to help you identify mistranscribed words, punctuation, and who is speaking."},
            {"role": "user", "content": f"Please clean this transcript: {chunk}."},
        ],
        max_tokens=4000,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return response.choices[0]['message']['content'].strip()


def split_into_chunks(text, tokens=3000):
    words = text.split()
    chunks = [' '.join(words[i:i + tokens]) for i in range(0, len(words), tokens)]
    return chunks

def process_chunks(input_file, output_file):
    text = load_text(input_file)
    chunks = split_into_chunks(text)
    responses = [call_openai_api(chunk) for chunk in chunks]
    save_to_file(responses, output_file)

if __name__ == "__main__":
    input_file = "rough_transcript.txt"
    output_file = "clean_transcript.txt"
    process_chunks(input_file, output_file)