import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import errorHandler from "./middlewares/error.middleware";
import loggerMiddleware from "./middlewares/logger.middleware";
import authMiddleware from "./middlewares/auth.middleware";
import Message from "./models/Message";

dotenv.config();
const PORT = process.env.PORT || 9001;
const DB_URL = process.env.DB_URL as string;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// ✅ Apply middlewares before routes
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); // Logs every request

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", async (data) => {
        try {
            const { userId, text } = data;
            if (!userId || !text) {
                console.log("Invalid message data received:", data);
                return;
            }

            // ✅ Store message in MongoDB
            const message = new Message({ userId, text });
            await message.save();

            // ✅ Broadcast the message
            io.emit("message", message);
        } catch (error) {
            console.error("Error storing message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// ✅ Start the server
const startServer = async () => {
    try {
        await mongoose.connect(DB_URL, {});

        console.log("✅ Database connected successfully");

        server.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};

startServer();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/api/messages", authMiddleware, messageRoutes); // Protect messages route

// ✅ Global error handler (MUST be at the end)
app.use(errorHandler);
