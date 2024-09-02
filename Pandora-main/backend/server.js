import "dotenv/config";
import "express-async-errors";

import express from "express";
import { app, server } from "./socket/socket.js";

import connectDB from "./connectDB/connect.js";
import authRoutes from "./routes/authRoutes.js";
import commRoutes from "./routes/commRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import errorHandlerMiddleware from "./middleware/errorHandleMiddleware.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/comm", commRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log(`Databse connected`);
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT} ...`);
        });
    } catch (error) {
        console.log(`Error while trying to host server ${error}`);
    }
};

start();
