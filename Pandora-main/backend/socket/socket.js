import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

io.on("connection", async (socket) => {
    console.log(`A new user has joined ${socket.id}`);

    socket.on("speechToText", async (audioBlob, callback) => {
        try {
            const buffer = Buffer.from(audioBlob);
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const tempFilePath = path.join(
                __dirname,
                "../temp/audioInput.webm"
            );
            fs.writeFileSync(tempFilePath, buffer);

            const res = await axios.post(
                "http://localhost:3001/api/comm/getText",
                {
                    tempFilePath,
                }
            );

            callback(res.data.data);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("textToSpeech", async (text, callback) => {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const tempFilePath = path.join(
                __dirname,
                "../.././frontend/./temp/audioOutput.mp3"
            );

            const { data } = await axios.post(
                "http://localhost:3001/api/message/getOutput",
                { chatInput: text }
            );

            const res = await axios.post(
                "http://localhost:3001/api/comm/getSpeech",
                {
                    tempFilePath,
                    text: data.output,
                }
            );

            callback(data.output);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on(
        "saveMessage",
        async (chatInput, chatOutput, token, id, callback) => {
            if (token && id) {
                const res = await axios.post(
                    "http://localhost:3001/api/message/saveMessage",
                    {
                        userId: id,
                        message: [chatInput, chatOutput],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            callback(chatInput, chatOutput);
        }
    );
});

export { app, io, server };
