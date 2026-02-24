import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectToMongo } from "./db.js";
import route from "./routes/askroute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", route);

const PORT = process.env.PORT ;

async function startServer() {
  try {
    await connectToMongo();
    console.log("Mongodb connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

startServer();