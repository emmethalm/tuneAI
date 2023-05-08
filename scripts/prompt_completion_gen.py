import openai
from concurrent.futures import ThreadPoolExecutor

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
            {
                "role": "system",
                "content": 'I have the following text transcript that in need to put in JSONL prompt-completion pair format for fune tuning. Example format, "{\\"prompt\\": \\"Who are you?\\", \\"completion\\": \\"I am Lebron James, an American professional basketball player for the Los Angeles Lakers and an all around nice guy.\\"}" Please generate 10 to 15 appropriate questions for the following text and place the questions and text in JSONL format. The \'completion\' should come verbatim from the text. You must use the \'you\' form for all prompt questions, never say "the speaker". You must utilize the entire text in the completion. Always answer the completion from the first person:',
            },
            {"role": "user", "content": f"Transcript: {chunk}."},
        ],
        max_tokens=1750,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return response.choices[0]['message']['content'].strip()

def split_into_chunks(text, tokens=1500):
    words = text.split()
    chunks = [' '.join(words[i:i + tokens]) for i in range(0, len(words), tokens)]
    return chunks

def process_chunks(input_file, output_file):
    text = load_text(input_file)
    chunks = split_into_chunks(text)
    
    # Use ThreadPoolExecutor to process chunks in parallel
    with ThreadPoolExecutor() as executor:
        responses = list(executor.map(call_openai_api, chunks))

    save_to_file(responses, output_file)

if __name__ == "__main__":
    input_file = "clean_transcript.txt"
    output_file = "prompt_completion_pairs.jsonl"
    process_chunks(input_file, output_file)
