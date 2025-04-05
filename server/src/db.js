import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL


if(!MONGODB_URL){
    throw new Error("MONGODB_URL is not defined in environment variables");
}


export const connectDB = async() => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to mongodb successfully");
    } catch(error){
        console.error('Error connecting to mongoDB', error);
        throw new Error('DB connection failed');
    }
}





