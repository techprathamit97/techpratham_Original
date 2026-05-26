import mongoose from "mongoose";

let isConnected = false;

export async function connectMongo() {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL environment variable is missing");
    throw new Error("Please add your MONGODB_URL to environment variables");
  }

  try {
    console.log("🔄 Attempting MongoDB connection...");
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "database",
    });
    isConnected = true;
    console.log(`✅ MongoDB connected to ${db.connection.host} - Database: database`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("❌ Connection string:", process.env.MONGODB_URL ? "Present" : "Missing");
    throw new Error(`Error connecting to MongoDB: ${error.message}`);
  }
}