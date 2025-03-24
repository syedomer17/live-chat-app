// src/controllers/message.controller.ts
import { Request, Response } from 'express';
import Message from '../models/Message';

export const sendMessage = async (req: Request, res: Response):Promise<void> => {
    try {
        const { userId, text } = req.body;
        if (!userId || !text) {
             res.status(400).json({ message: 'User ID and text are required' });
             return
        }

        const message = await Message.create({ userId, text });
         res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
         res.status(500).json({ message: 'Server error', error });
    }
};

export const getMessages = async (_req: Request, res: Response):Promise<void> => {
    try {
        const messages = await Message.findAll();
         res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
         res.status(500).json({ message: 'Server error', error });
    }
};
