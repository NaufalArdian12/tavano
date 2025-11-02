import 'dotenv/config';

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/grade.js";
import { Prisma, PrismaClient } from '@prisma/client';
import profileRoutes from "./routes/profiles.js"
import quizRouter from "./routes/quiz.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", quizRouter);

const prisma = new PrismaClient();

async function testDbConnection() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

testDbConnection();

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => console.log(`API running on :${port}`));
