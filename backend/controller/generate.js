import { pipeline } from "@xenova/transformers";
import { connectToMongo, getCollection } from "./db.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

let embedder = null;
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

async function getEmbeddings(text) {
  const embed = await getEmbedder();
  const result = await embed(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
}

function flattenInsuranceRecord(record) {
  const { policyNumber, name, age, insuranceType, plan, premium, coverage, startDate, endDate, claims = [] } = record;

  const claimText = claims.length > 0
    ? claims.map((c, i) => `Claim ${i + 1}: ID ${c.claimId}, Date ${c.date}, Amount ₹${c.amount}, Reason: ${c.reason}, Status: ${c.status}`).join("; ")
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

async function generateAndStore() {
  await connectToMongo();

  const fileData = fs.readFileSync("./data/details.json", "utf-8");
  const insuranceArray = JSON.parse(fileData);
  console.log(`Loaded ${insuranceArray.length} records`);

  const collection = await getCollection("insurance_embeddings");
  const documents = [];

  for (const record of insuranceArray) {
    const text = flattenInsuranceRecord(record);
    const embedding = await getEmbeddings(text);
    console.log(`✅ ${record.name} - dimensions: ${embedding.length}`);

    documents.push({
      text,
      embedding,
      policyNumber: record.policyNumber,
      customerName: record.name,
      insuranceType: record.insuranceType,
      createdAt: new Date(),
    });
  }

  if (documents.length > 0) {
    await collection.insertMany(documents);
    console.log(`✅ Inserted ${documents.length} embeddings into MongoDB`);
  }

  process.exit(0);
}

generateAndStore();