import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response):Promise<void> => {  
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
             res.status(400).json({ message: 'User already exists' });
             return
            }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

         res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
         res.status(500).json({ message: 'Server error', error: err });
    }
};

export const login = async (req: Request, res: Response):Promise<void> => {  
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) { 
            res.status(400).json({ message: 'User not found' });
            return
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) { res.status(400).json({ message: 'Invalid credentials' });
        return
    }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

         res.json({ message: 'Login successful', token });
    } catch (err) {
         res.status(500).json({ message: 'Server error', error: err });
    }
};
