import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {  getCollection } from "../db.js";

dotenv.config();

// ===============================
// Gemini setup
// ===============================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
  model: "models/gemini-embedding-001",
});

// ===============================
// Convert insurance record → text
// ===============================
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
Policy Number: ${policyNumber}
Customer: ${name} (${age})
Insurance Type: ${insuranceType}
Plan: ${plan}
Premium: ₹${premium}, Coverage: ₹${coverage}
Period: ${startDate} → ${endDate}
Claims: ${claimText}
`.trim();
}

// ===============================
// Generate & store embeddings
// ===============================
export async function generateAndStoreEmbeddings() {
  try {
    // 1️ Read JSON file
    const fileData = fs.readFileSync("./data/details.json", "utf-8");
    const insuranceArray = JSON.parse(fileData);

    console.log(`Loaded ${insuranceArray.length} insurance records`);

    const collection = await getCollection("insurance_embeddings");
    const documents = [];

    // 2️ Process each insurance record
    for (const record of insuranceArray) {
      const text = flattenInsuranceRecord(record);
 const result = await embeddingModel.embedContent({
      content: {
        parts: [{ text }],
      },
    });

    const embedding = result.embedding.values;
    console.log("Embedding size:", embedding.length);
      documents.push({
        text,
        embedding,
        policyNumber: record.policyNumber,
        customerName: record.name,
        insuranceType: record.insuranceType,
        createdAt: new Date(),
      });

      console.log(`Generated embedding for ${record.name}`);
    }

    // 3️ Insert into MongoDB
    if (documents.length > 0) {
      await collection.insertMany(documents);
      console.log(`Inserted ${documents.length} embeddings into MongoDB`);
    }
  } catch (error) {
    console.error(" Error:", error.message);
  } finally {
  
    console.log("Database connection closed");
  }
}
