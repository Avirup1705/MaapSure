import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import instrumentRoutes from "./routes/instrumentRoutes.js";

dotenv.config();

// Force Node to use Google's DNS for lookups — fixes ECONNREFUSED on
// mongodb+srv:// queries caused by a broken/restrictive local DNS resolver.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route — confirms server is alive
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MaapSure backend is running",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Instrument routes — create, scan/get, list all
app.use("/api/instruments", instrumentRoutes);

// Connect to MongoDB, then start the server only if connection succeeds
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
