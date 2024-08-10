import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let isConnected = false // track the connection

export const connectToDB = async () => {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        console.log("MongoDB is already connected")
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME,
        })

        isConnected = true

        console.log("MongoDB connected")
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}