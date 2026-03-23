import { pipeline } from "@xenova/transformers";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Local embedding model - no API key needed
let embedder = null;
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function getEmbeddings(text) {
  const embed = await getEmbedder();
  const result = await embed(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
}

export async function getAnswerFromLLM(query, context) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Answer ONLY using context below. If not in context, say "I don't know".

Context: ${context}

Question: ${query}`,
      },
    ],
  });
  return response.choices[0].message.content;
}