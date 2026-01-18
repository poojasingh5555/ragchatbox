import OpenAI from "openai";
import mongoose from "mongoose";
import InsuranceEmbedding from "../models/insurancemodel.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: create vector search aggregation using Mongoose
function buildAggregationPipeline(queryEmbedding) {
  return [
    {
      $vectorSearch: {
        queryVector: queryEmbedding,
        path: "embedding",
        numCandidates: 10,
        limit: 3,
        index: "insurance_vector_index", // Make sure this matches your Atlas index
      },
    },
    {
      $project: {
        text: 1,
        policyNumber: 1,
        customerName: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];
}

// Generate embedding for query
async function getQueryEmbedding(query) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  return response.data[0].embedding;
}

// Generate answer from GPT using context
async function getAnswerFromLLM(query, context) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that answers questions based only on the provided context.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${query}`,
      },
    ],
  });
  return completion.choices[0].message.content;
}

// Main controller for /ask
export async function askQuestion(req, res) {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    // 1 Connect to MongoDB via Mongoose if not connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME,
      });
      console.log(" Connected to MongoDB via Mongoose");
    }

    //  Generate query embedding
    const queryEmbedding = await getQueryEmbedding(query);

    //  Run vector search via Mongoose aggregation
    const results = await InsuranceEmbedding.aggregate(
      buildAggregationPipeline(queryEmbedding)
    );

    if (!results || results.length === 0) {
      return res.json({ answer: "No relevant information found." });
    }

    // Combine top results as context
    const context = results.map((r) => r.text).join("\n\n");

    // Send query + context to GPT
    const answer = await getAnswerFromLLM(query, context);

    res.json({ answer });
  } catch (error) {
    console.error(" Error:", error);
    res.status(500).json({ error: error.message });
  }
}
