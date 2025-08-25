import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  text: string;
  userId: mongoose.Types.ObjectId; // References User model
}

const MessageSchema = new Schema<IMessage>(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
