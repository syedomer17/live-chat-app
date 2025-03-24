import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import messageRoutes from './routes/message.routes';
import errorHandler from './middlewares/error.middleware';
import loggerMiddleware from './middlewares/logger.middleware';
import authMiddleware from './middlewares/auth.middleware';
import Message from './models/Message';

dotenv.config();
const PORT = process.env.PORT || 9001;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// ✅ Apply middlewares before routes
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); // Logs every request

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', async (data) => {
        try {
            const { userId, text } = data;
            if (!userId || !text) {
                console.log('Invalid message data received:', data);
                return;
            }

            // Store message in the database
            const message = await Message.create({ userId, text });

            // Broadcast the message
            io.emit('message', message);
        } catch (error) {
            console.error('Error storing message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const startServer = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced');
        
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database sync error:', error);
    }
};

startServer();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/api/messages', authMiddleware, messageRoutes); // Protect messages route

// ✅ Global error handler (MUST be at the end)
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
})