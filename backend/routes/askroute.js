import express from "express";
import { askQuestion } from "../controller/askcontroller.js";

const router = express.Router();

router.post("/ask", askQuestion);

export default router;
