import fs from "fs"
import path from "path";

export const deleteFiles = async (fileName: string) => {
    try {
        const audioFilePath = path.resolve(__dirname, `../../../tmp/extractedAudio/${fileName}.mp3`);
        const videoFilePath = path.resolve(__dirname, `../../../tmp/videoUploads/${fileName}.webm`);
        await fs.promises.unlink(videoFilePath)
            .then(() => {
                // console.log("Video file deleted successfully!");
                return fs.promises.unlink(audioFilePath)
            })
            .then(() => {
                // console.log("Audio file deleted successfully!");
            })
    } catch (error) {
        console.log("Audio or video delete failed!", error);
    }
}