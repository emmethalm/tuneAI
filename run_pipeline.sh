#!/bin/bash

# Replace the paths below with the actual paths of the respective files
YOUTUBE_SCRAPER="scripts/youtube_scraper.ts"
CLEANER="scripts/cleaner.py"
PROMPT_COMPLETION_GEN="scripts/prompt_completion_gen.py"
OPENAI_API_KEY="your_openai_api_key_here"

# Check if a YouTube URL is provided as an argument
if [ -z "$1" ]; then
    echo "Usage: ./run_pipeline.sh <YouTube_URL>"
    exit 1
fi

# Run the YouTube scraper
echo "Running YouTube scraper..."
tsc $YOUTUBE_SCRAPER
node "${YOUTUBE_SCRAPER%.*}.js" "$1"

# Run the cleaner script
echo "Running cleaner.py..."
python $CLEANER

# Run the prompt-completion generator script
echo "Running prompt_completion_gen.py..."
python $PROMPT_COMPLETION_GEN

# Set the OpenAI API key
echo "Setting OpenAI API key..."
export OPENAI_API_KEY=$OPENAI_API_KEY

# Run the fine-tuning command
echo "Running OpenAI fine-tuning..."
openai api fine_tunes.create -t prompt_completion_pairs.jsonl -m davinci

echo "Pipeline complete. You did it, king."
