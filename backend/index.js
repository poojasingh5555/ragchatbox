import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./db.js";
import OpenAI from "openai";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.get("/", (req,res) => {
    res.send("completed")
})
 
connectDb();
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`app listen on ${PORT}`)

)