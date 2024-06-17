import fs from "fs";
import OpenAI from "openai";
import path from "path";

const openai = new OpenAI({
    apiKey: process.env.CHAT_GPT_API_KEY,
});

export interface IAudioToText {
    isTextConverted: boolean
    text: string | null
}

export const audioToText = async (fileName: string): Promise<IAudioToText> => {
    const audioFilePath = path.resolve(__dirname, `../../../tmp/extractedAudio/${fileName}.mp3`);
    let audioToText: IAudioToText = {
        isTextConverted: false,
        text: null
    }
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: "whisper-1",
        });
        audioToText.isTextConverted = true;
        audioToText.text = transcription.text
        return audioToText;
    } catch (error) {
        console.log("--- Error in getting text from audio ---", error);
        return audioToText;
    }
}