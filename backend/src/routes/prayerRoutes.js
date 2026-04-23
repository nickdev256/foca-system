import express from "express";
import {
  getIncomingPrayers,
  getPrayerById,
  createPrayer,
  updatePrayer,
} from "../controllers/prayerController.js";

const router = express.Router();

/* =========================
   ROUTES (ORDER MATTERS)
========================= */

// ✅ Specific routes FIRST
router.get("/incoming", getIncomingPrayers);

// ✅ Create
router.post("/", createPrayer);

// ✅ Update
router.put("/:id", updatePrayer);

// ✅ Get by ID LAST
router.get("/:id", getPrayerById);

// ❗ OPTIONAL: root route
router.get("/", getIncomingPrayers);

export default router;