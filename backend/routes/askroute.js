import express from "express";
import {askQuestion, register, loginuser } from "../controller/askcontroller.js";
const router = express.Router();

router.post("/ask", askQuestion);
router.post('/register',register);
router.post("/login",loginuser);

export default router;