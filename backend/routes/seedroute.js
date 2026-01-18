import express from "express";
import { generateAndStoreEmbeddings } from "../controller/seedcontroller.js";

const router = express.Router();

router.post("/seed", generateAndStoreEmbeddings);

export default router;
