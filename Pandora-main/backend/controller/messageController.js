import OpenAI from "openai";
import { StatusCodes } from "http-status-codes";
import "dotenv/config";
import Message from "../model/MessageModel.js";
import User from "../model/UserModel.js";
import { BadRequestError, UnauthenticatedError } from "../errors/Errors.js";

const getOutput = async (req, res) => {
    let { chatInput } = req.body;
    if (!chatInput)
        return res.status(StatusCodes.OK).json({
            output: "Please communicate to converse",
        });

    chatInput =
        chatInput +
        "Give this answer as if you are a mental health chat bot in simple concise statements";
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        });

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: chatInput }],
            model: "gpt-3.5-turbo",
        });

        const output = completion.choices[0].message.content;

        res.status(StatusCodes.OK).json({
            output,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            error,
        });
    }
};

const saveMessage = async (req, res) => {
    const { message, userId } = req.body;
    if (!message) throw new BadRequestError("Cannot save empty message");
    if (!userId) throw new UnauthenticatedError("User has not logged in");
    try {
        let messages = await Message.findOne({ senderId: userId });
        if (!messages)
            messages = await Message.create({ senderId: userId, message });
        else {
            messages.message.push(...message);
            await messages.save();
        }
        res.status(StatusCodes.CREATED).json({ status: "Saved successfully" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: "Error while saving message",
        });
    }
};

const getMessages = async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new UnauthenticatedError("User has not logged in");
    const user = await User.findById(userId);
    if (!user) throw new BadRequestError("User does not exist");
    const messages = await Message.findOne({ senderId: userId });
    res.status(StatusCodes.OK).json({ messages: messages.message });
};

export { getOutput, saveMessage, getMessages };
