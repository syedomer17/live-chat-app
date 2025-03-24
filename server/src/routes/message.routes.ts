// src/routes/message.routes.ts
import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller';

const router = Router();

router.post('/send', sendMessage); // Send a new message
router.get('/', getMessages); // Fetch all messages

export default router;
