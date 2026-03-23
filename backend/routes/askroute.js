import express from "express";
import { askQuestion } from "../controller/askcontroller.js";
import { handlePdfUpload } from "../controller/pdfcontroller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/ask", askQuestion);
router.post("/upload-pdf", upload.single("pdf"), handlePdfUpload);

export default router;