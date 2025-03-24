import express from 'express';
import { sendMessage,getMessages } from '../controllers/chat.controller'; 

const router = express.Router();

router.post('/send', sendMessage);
router.get('/messages', getMessages);

export default router;
