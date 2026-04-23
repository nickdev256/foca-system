import dotenv from "dotenv";

/* =======================
   🔥 LOAD ENV (MUST BE FIRST)
======================= */
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

/* =======================
   DEBUG ENV (VERY IMPORTANT)
======================= */
console.log("🔐 OPENAI KEY:", process.env.OPENAI_API_KEY ? "FOUND ✅" : "MISSING ❌");
console.log("🗄️ MONGO URI:", process.env.MONGO_URI ? "FOUND ✅" : "MISSING ❌");

/* =======================
   PATH FIX (ES MODULES)
======================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =======================
   ENSURE UPLOADS FOLDER EXISTS
======================= */
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log("📁 uploads folder created");
}

/* =======================
   INIT APP
======================= */
const app = express();

/* =======================
   SECURITY
======================= */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* =======================
   BODY PARSING
======================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   LOGGER
======================= */
app.use(morgan("dev"));

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(uploadsPath));

/* =======================
   RATE LIMIT
======================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", limiter);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.json({
    message: "FOCA Connect API running 🚀",
    status: "healthy",
  });
});

/* =======================
   ROUTES IMPORT
======================= */
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import budgetRequestRoutes from "./routes/budgetRequestRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// CUSTOM
import prayerRoutes from "./routes/prayerRoutes.js";
import counselingRoutes from "./routes/counselingRoutes.js";

// GENERIC
import {
  announcementsRouter,
  attendanceRouter,
  eventsRouter,
  financeRouter,
  membersRouter,
  ministriesRouter,
  sermonsRouter,
  usersRouter,
  visitorsRouter,
} from "./routes/index.js";

/* =======================
   MAIN ROUTES
======================= */

// 🔐 Auth
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 🔥 Custom
app.use("/api/prayer", prayerRoutes);
app.use("/api/counseling", counselingRoutes);
app.use("/api/ai", aiRoutes);

// 📦 CRUD
app.use("/api/users", usersRouter);
app.use("/api/members", membersRouter);
app.use("/api/visitors", visitorsRouter);
app.use("/api/ministries", ministriesRouter);
app.use("/api/events", eventsRouter);
app.use("/api/sermons", sermonsRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/finance", financeRouter);
app.use("/api/attendance", attendanceRouter);

// 📊 Other
app.use("/api/budget-requests", budgetRequestRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/super-admin", superAdminRoutes);

// 🌍 Public
app.use("/api", publicRoutes);

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("⏳ Connecting to database...");

    await connectDB();

    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();