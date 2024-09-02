import fs from "fs";
import OpenAI from "openai";
import { StatusCodes } from "http-status-codes";
import "dotenv/config";

const getText = async (req, res) => {
    const { tempFilePath } = req.body;
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        });

        const data = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-1",
            response_format: "text",
        });

        res.status(StatusCodes.OK).json({ status: "Successfull", data });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Error",
            error,
        });
    }
};

const getSpeech = async (req, res) => {
    const { text, tempFilePath } = req.body;
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        });

        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        fs.writeFileSync(tempFilePath, buffer);

        res.status(StatusCodes.OK).json({ status: "Successfull", data: mp3 });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Error",
            error,
        });
    }
};

export { getText, getSpeech };
