import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
  model: "models/gemini-embedding-001",
});

const textModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function getEmbeddings(text) {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
  });

  return result.embedding.values;
}

export async function getAnswerFromLLM(query, context) {
  const prompt = `
You are a helpful assistant.
Answer ONLY using the provided context.
If the answer is not in the context, say "I don't know".

Context:
${context}

Question: ${query}
Answer:
`;

  const result = await textModel.generateContent(prompt);
  return result.response.text();
}