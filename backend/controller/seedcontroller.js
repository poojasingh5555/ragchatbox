import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";
import InsuranceEmbedding from "../models/insurancemodel.js";
import mongoose from "mongoose";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to flatten insurance record
function flattenInsuranceRecord(record) {
  const {
    policyNumber,
    name,
    age,
    insuranceType,
    plan,
    premium,
    coverage,
    startDate,
    endDate,
    claims = [],
  } = record;

  const claimText =
    claims.length > 0
      ? claims
          .map(
            (c, i) =>
              `Claim ${i + 1}: ID ${c.claimId}, Date ${c.date}, Amount ₹${c.amount}, Reason: ${c.reason}, Status: ${c.status}`
          )
          .join("; ")
      : "No claim history";

  return `
Policy Number: ${policyNumber}.
Customer Name: ${name}, Age: ${age}.
Insurance Type: ${insuranceType}.
Plan: ${plan}.
Premium: ₹${premium}, Coverage: ₹${coverage}.
Policy Period: ${startDate} to ${endDate}.
Claims: ${claimText}.
`.replace(/\s+/g, " ").trim();
}

// Seed controller
export async function generateAndStoreEmbeddings(req, res) {
  try {
    // 1 Connect to MongoDB via Mongoose
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME,
      });
      console.log("✅ Connected to MongoDB via Mongoose");
    }

    // 2️ Read insurance data
    const fileData = fs.readFileSync("./seed/insurance_data.json", "utf-8");
    const insuranceArray = JSON.parse(fileData);
    console.log(` Loaded ${insuranceArray.length} insurance records`);

    const texts = insuranceArray.map(flattenInsuranceRecord);

    // 3️ Generate embeddings in batch
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    const documents = response.data.map((item, i) => ({
      text: texts[i],
      embedding: item.embedding,
      policyNumber: insuranceArray[i].policyNumber,
      customerName: insuranceArray[i].name,
      insuranceType: insuranceArray[i].insuranceType,
    }));

    // 4️ Insert documents using Mongoose
    await InsuranceEmbedding.insertMany(documents, { ordered: false });

    console.log(` Inserted ${documents.length} embeddings into MongoDB.`);

    res.json({ message: `Inserted ${documents.length} embeddings.` });
  } catch (error) {
    console.error(" Error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // Optional: close Mongoose connection if this script runs standalone
    // await mongoose.disconnect();
  }
}
