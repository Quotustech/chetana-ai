import ffmpeg from "ffmpeg";
import path from "path";
import fs from 'fs';

export const convertToAudio = async (filename: string): Promise<boolean> => {
    try {
        const fileName = filename;
        const videoFilePath = path.resolve(__dirname, `../../../tmp/videoUploads/${fileName}.webm`);
        const audioFilePath = path.resolve(__dirname, `../../../tmp/extractedAudio/${fileName}.mp3`);

        // Check if video file exists
        if (!fs.existsSync(videoFilePath)) {
            // console.log("Video file does not exist:", videoFilePath);
            return false;
        }
        // console.log("File checked!");

        // Open audio file for writing
        await fs.promises.writeFile(audioFilePath, '')
            .then(() => {
                // console.log("Audio created");
            })
            .catch((err) => {
                console.log('--- Unable to create .mp3 file ---', err);
                return false
            })
        // Check if audio file exists
        if (!fs.existsSync(audioFilePath)) {
            // console.log("audio filePath file does not exist:", audioFilePath);
            return false;
        }

        const process = await new ffmpeg(videoFilePath);
        return process.fnExtractSoundToMP3(audioFilePath)
            .then((audio) => {
                // console.log("Audio extracted successfully:", audio);
                return true;
            })
            .catch((err) => {
                console.log("Error converting to audio:", err);
                return false;
            });
    } catch (err) {
        console.log("Error in creating audio file:", err);
        return false;
    }
}
