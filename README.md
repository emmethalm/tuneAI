# AutoFinetune
Fine tune an OpenAI model in one command line.

AutoFineTune is an open-source project aimed at providing an effortless way to fine-tune OpenAI models using YouTube video transcripts or text input. The project automates the process of transcript cleaning, prompt-completion pair generation, and training, making it easier to refine AI models for specific tasks.

*Features*
- Automatically clean YouTube video transcripts
- Generate prompt-completion pairs from cleaned transcripts
- Fine-tune OpenAI models based on generated prompt-completion pairs
- Support for both YouTube video links and text input

Installation

Prerequisites
- Python 3.7 or later
- An OpenAI API key

Steps
1. Clone the repository:

git clone https://github.com/emmethalm/autofinetune.git

2. Change to the project directory:

cd autofinetune

3. Install the required packages:

pip install -r requirements.txt

4. Create a .env file in the project root directory and add your OpenAI API key:

echo "OPENAI_API_KEY=your_api_key_here" > .env

*Usage*
Fine-tuning with a YouTube video transcript

./run_pipeline.sh https://www.youtube.com/watch?v=your_video_id_here

Fine-tuning with a text file

./run_pipeline.sh --text-file path/to/your/text_file.txt

Additional options
--epochs: Specify the number of training epochs (default: 1)
--batch-size: Specify the training batch size (default: 8)
--prompt-length: Specify the maximum prompt length (default: 150)
--response-length: Specify the maximum response length (default: 150)

License
This project is licensed under the MIT License - see the LICENSE.md file for details.
