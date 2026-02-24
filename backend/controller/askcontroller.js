import { getCollection } from "../db.js";
import { getEmbeddings, getAnswerFromLLM } from "../services/geminiservices.js";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/User.js";



dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

function buildAggregationPipeline(queryEmbedding) {
  return [
    {
      $vectorSearch: {
        index: "vector_index_rag",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5,
      },
    },
  ];
}

export const askQuestion = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const queryEmbedding = await getEmbeddings(query);

    const collection = await getCollection("insurance_embeddings");
    const pipeline = buildAggregationPipeline(queryEmbedding);

    const results = await collection.aggregate(pipeline).toArray();

    if (!results.length) {
      return res.json({ answer: "No relevant information found." });
    }

    const context = results.map(r => r.text).join("\n\n");
    const answer = await getAnswerFromLLM(query, context);

    res.json({
      answer,
      sources: results.length,
    });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message });
  }
};
 export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("BODY:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existuser = await User.findOne({ email });

    if (existuser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashpassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

 export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
 console.log("Login email:", email);
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
   console.log("User from DB:", user);
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};