import mongoose, { Document, Schema } from "mongoose";

// Define User Interface for TypeScript
interface IUser extends Document {
  username: string;
  password: string;
}

// Define User Schema
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

// Create User Model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
