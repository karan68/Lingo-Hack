import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import campaignRoutes from "./routes/campaign.routes.js";
import culturalRoutes from "./routes/cultural.routes.js";

dotenv.config({ path: "../.env" });
// Also load from local .env if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/campaign", campaignRoutes);
app.use("/api/cultural", culturalRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    services: {
      lingoDotDev: !!process.env.LINGODOTDEV_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      huggingFace: !!process.env.HF_API_KEY,
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`\n🌐 Cultural Context Adapter API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`\n   Services:`);
  console.log(`   ├─ lingo.dev SDK: ${process.env.LINGODOTDEV_API_KEY ? "✅ configured" : "❌ missing LINGODOTDEV_API_KEY"}`);
  console.log(`   ├─ Anthropic Claude: ${process.env.ANTHROPIC_API_KEY ? "✅ configured" : "⚠️  missing ANTHROPIC_API_KEY groq is being used instead"}`);
  console.log(`   └─ Hugging Face: ${process.env.HF_API_KEY ? "✅ configured" : "⚠️  missing HF_API_KEY (image analysis disabled)"}`);
  console.log();
});
