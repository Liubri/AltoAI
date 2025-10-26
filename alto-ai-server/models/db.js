import mongoose from "mongoose";

export default async function connectDB(dbUri) {
  try {
    const conn = await mongoose.connect(dbUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop the server if DB fails to connect
  }
}