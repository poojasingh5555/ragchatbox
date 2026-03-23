import { getCollection } from "../db.js";
import { getEmbeddings, getAnswerFromLLM } from "../services/aiservices.js";


import dotenv from "dotenv";






dotenv.config();


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
 