import 'dotenv/config';

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";
import { Prisma, PrismaClient } from '@prisma/client';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", aiRoutes);

const prisma = new PrismaClient();

// Test DB connection
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

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => console.log(`API running on :${port}`));
