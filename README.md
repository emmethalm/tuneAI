# AutoFinetune

Fine-tune an OpenAI model in one command line.

TuneAI provides an effortless way to fine-tune OpenAI models using YouTube video transcripts or text input. The project automates the process of transcript cleaning, prompt-completion pair generation, and training, making it easier to refine AI models for specific tasks.

## Features

- Automatically clean YouTube video transcripts
- Generate prompt-completion pairs from cleaned transcripts
- Fine-tune OpenAI models based on generated prompt-completion pairs
- Support for both YouTube video links and text input

## Installation

### Prerequisites

- Python 3.7 or later
- An OpenAI API key

### Steps

1. Clone the repository:
git clone https://github.com/emmethalm/tuneAI.git

2. Change to the project directory:
cd tuneAI

3. Install the required packages:

npm install

npm install openai

npm install python3

4. Create a .env file in the project root directory and add your OpenAI API key OR just add your API key to cleaner.py and prompt_completion_gen.py:
echo "OPENAI_API_KEY=your_api_key_here" > .env

## Usage

### Fine-tuning with a YouTube video transcript
./run_pipeline.sh https://www.youtube.com/watch?v=your_video_id_here

### Fine-tuning with a text file
./run_pipeline.sh --text-file path/to/your/text_file.txt

### Additional options

- --epochs: Specify the number of training epochs (default: 1)
- --batch-size: Specify the training batch size (default: 8)
- --prompt-length: Specify the maximum prompt length (default: 150)
- --response-length: Specify the maximum response length (default: 150)

## Best Practices

While you can run the fine-tuning process in one line by running the pipeline, for more precise results run each script individually, check the outputs at each step, and tweak the context sentence in the prompt in prompt_completion_gen.py.

To run step by step:

(install dependencies)

1. tsc youtube_scraper.ts
2. node youtube_scraper.js
3. python3 cleaner.py
4. python3 prompt_comnpletion_gen.py
5. export OPENAI_API_KEY=$OPENAI_API_KEY
6. openai api fine_tunes.create -t prompt_completion_pairs.jsonl -m davinci

The quality of your fine-tuning is fully dependent on the quality of your data.

Happy building!

### Share what you build with me on Twitter [@ehalm_](https://twitter.com/ehalm_) 👋

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

