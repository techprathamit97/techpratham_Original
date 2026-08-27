import mongoose from "mongoose";

let isConnected = false;

export async function connectMongo() {
  // No log here: this runs on every API call and was the largest source of
  // terminal noise. Connection success and failure are still logged below.
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL environment variable is missing");
    throw new Error("Please add your MONGODB_URL to environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "database",
    });
    isConnected = true;
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("❌ Connection string:", process.env.MONGODB_URL ? "Present" : "Missing");
    throw new Error(`Error connecting to MongoDB: ${error.message}`);
  }
}