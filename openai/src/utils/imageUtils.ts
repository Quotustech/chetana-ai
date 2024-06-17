import { promises as fs } from 'fs';
import path from "path";

async function readImageFile(filePath: string): Promise<string> {
    // console.log('file path' , filePath)
    try {
        const data: Buffer = await fs.readFile(path.join(__dirname , filePath));
        const base64Image: string = data.toString('base64');
        return base64Image;
    } catch (error) {
        console.error('Error reading image file:', error);
        throw error;
    }
}

export { readImageFile };
