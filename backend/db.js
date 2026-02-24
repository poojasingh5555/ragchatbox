import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URL;

let client;
let db;

export async function connectToMongo() {
  try {
    // ✅ Connect Mongoose (for User model)
    await mongoose.connect(uri);
    console.log("✅ Mongoose Connected");

    // ✅ Connect Native MongoClient (for RAG vector search)
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();

    console.log("✅ MongoClient Connected");

    return db;

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

export async function getCollection(collectionName) {
  if (!db) {
    throw new Error("MongoDB not connected. Call connectToMongo() first.");
  }
  return db.collection(collectionName);
}