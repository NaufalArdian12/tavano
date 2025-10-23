import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_,res)=>res.json({ ok:true }));
app.use("/api", aiRoutes);

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`API running on :${port}`));
