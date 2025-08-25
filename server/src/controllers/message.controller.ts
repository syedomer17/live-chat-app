import { Request, Response } from "express";
import Message from "../models/Message";

// ✅ Send a message
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, text } = req.body;
        if (!userId || !text) {
            res.status(400).json({ message: "User ID and text are required" });
            return;
        }

        // Create and save message in MongoDB
        const message = new Message({ userId, text });
        await message.save();

        res.status(201).json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get all messages
export const getMessages = async (_req: Request, res: Response): Promise<void> => {
    try {
        const messages = await Message.find().populate("userId", "username"); // Populate user info
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
