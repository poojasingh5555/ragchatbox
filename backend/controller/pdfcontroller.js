// backend/controller/pdfController.js
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { getCollection } from "../db.js";
import { getEmbeddings } from "../services/aiservices.js";
import dotenv from "dotenv";
dotenv.config();

// ===============================
// PDF text extraction
// ===============================
export async function extractTextFromBuffer(buffer) {
  const uint8Buffer = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({
    data: uint8Buffer,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map(item => (typeof item.str === "string" ? item.str : ""))
      .filter(str => str.trim() !== "")
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

// ===============================
// Text utilities
// ===============================
export function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

export function chunkText(text, size = 1000, overlap = 200) {
  if (overlap >= size) throw new Error("Overlap must be less than chunk size");
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }
  return chunks;
}

// ===============================
// Add PDF to embeddings
// ===============================
export async function addPdfToInsuranceEmbeddings(pdfBuffer, sourceName = "uploaded.pdf") {
  try {
    const rawText = await extractTextFromBuffer(pdfBuffer);
    const cleanedText = cleanText(rawText);

    if (!cleanedText) {
      console.log("No text extracted from PDF");
      return;
    }

    const chunks = chunkText(cleanedText, 1000, 200);
    const collection = await getCollection("insurance_embeddings");
    const documents = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk || typeof chunk !== "string") continue;

      const embedding = await getEmbeddings(chunk); // ✅ Xenova
      documents.push({
        text: chunk,
        embedding,
        source: sourceName,
        chunkIndex: i,
        createdAt: new Date(),
      });
    }

    if (documents.length > 0) {
      await collection.insertMany(documents);
      console.log(`Inserted ${documents.length} PDF chunks into insurance_embeddings`);
    } else {
      console.log("No embeddings to insert");
    }
  } catch (err) {
    console.error("Error adding PDF to insurance_embeddings:", err.message);
    throw err; // ✅ rethrow
  }
}

// ===============================
// Handle PDF Upload (Express route)
// ===============================
export async function handlePdfUpload(req, res) {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");
    await addPdfToInsuranceEmbeddings(req.file.buffer, req.file.originalname);
    res.json({ message: "PDF content added to insurance embeddings" });
  } catch (err) {
    console.error("PDF upload error:", err);
    res.status(500).send("Server error");
  }
}