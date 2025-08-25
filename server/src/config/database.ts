import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 


const db : string = process.env.DB_URL as string
const dbConnect = async () => {
    try {
        await mongoose.connect(db)
        console.log("DB connected Successfully");
    } catch (error) {
        console.log(error);
    }
}
dbConnect();