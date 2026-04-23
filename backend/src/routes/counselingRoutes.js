import express from "express";
import mongoose from "mongoose";
import Counseling from "../models/CounselingSession.js";

const router = express.Router();

/* =========================
   GET INCOMING SESSIONS
========================= */
router.get("/incoming", async (req, res) => {
  try {
    console.log("📥 GET /counseling/incoming called");

    const data = await Counseling.find({ status: "open" })
      .sort({ createdAt: -1 });

    console.log(`📊 Found ${data.length} incoming sessions`);

    res.json(data);
  } catch (err) {
    console.log("❌ INCOMING ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ALL COUNSELING
========================= */
router.get("/", async (req, res) => {
  try {
    console.log("📥 GET /counseling called");

    const data = await Counseling.find().sort({ createdAt: -1 });

    console.log(`📊 Found ${data.length} sessions`);

    res.json(data);
  } catch (err) {
    console.log("❌ GET ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE COUNSELING SESSION
========================= */
router.post("/", async (req, res) => {
  try {
    console.log("🔥 POST /counseling HIT");
    console.log("📦 BODY RECEIVED:", req.body);

    const { memberName, topic, status, notes, followUpDate } = req.body;

    if (!memberName || !topic) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({
        message: "memberName and topic are required"
      });
    }

    const session = new Counseling({
      memberName,
      topic,
      status: status || "open",
      notes: notes || "",
      followUpDate: followUpDate || null,
    });

    await session.save();

    console.log("✅ SAVED SUCCESSFULLY:", session._id);

    res.status(201).json(session);

  } catch (err) {
    console.log("❌ POST ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE COUNSELING
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("✏️ UPDATE:", id);

    // ✅ Prevent ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updated = await Counseling.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(updated);
  } catch (err) {
    console.log("❌ UPDATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE COUNSELING
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑 DELETE:", id);

    // ✅ Prevent ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const deleted = await Counseling.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.log("❌ DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;