import { Request, Response } from "express";
import Message from "../models/Message";

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, text } = req.body; 
        
        if (!userId || !text) {
            res.status(400).json({ message: "User ID and text are required" });
            return;
        }

        // ✅ Mongoose way to create & save a message
        const message = new Message({ userId, text });
        await message.save();

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const messages = await Message.find()
            .populate("userId", "username") 
            .sort({ createdAt: -1 }); 
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
