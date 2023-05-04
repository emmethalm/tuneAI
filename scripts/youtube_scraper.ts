import { PythonShell } from 'python-shell';
import * as fs from 'fs';

async function getTranscript(videoId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const pyShell = new PythonShell('transcript_scraper.py', {
            pythonOptions: ['-u'],
            scriptPath: './',
            args: [videoId]
        });

        let transcript = '';

        pyShell.on('message', (message: string) => {
            transcript += message;
        });

        pyShell.end((err, _code, _signal) => {
            if (err) {
                reject(err);
            } else {
                resolve(transcript);
            }
        });
    });
}

async function main() {
    const videoUrl = 'https://www.youtube.com/watch?v=8JoTw_JuE78';
    const videoId = new URL(videoUrl).searchParams.get('v');
    const outputPath = 'rough_transcript.txt';

    const transcript = await getTranscript(videoId);
    fs.writeFileSync(outputPath, transcript);
    console.log(`Transcript saved to ${outputPath}`);
}

main();