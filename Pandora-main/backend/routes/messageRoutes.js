import express from "express";
import {
    getOutput,
    saveMessage,
    getMessages,
} from "../controller/messageController.js";
import authHandlerMiddleware from "../middleware/authHandlerMiddleware.js";

const router = express.Router();

router.post("/getOutput", getOutput);
router.post("/saveMessage", authHandlerMiddleware, saveMessage);
router.get("/getMessages/:userId", authHandlerMiddleware, getMessages);

export default router;
