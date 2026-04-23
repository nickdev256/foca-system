import express from "express";
import { upload } from "../middleware/upload.js";

import {
  getSermons,
  getSermonById,
  createSermon,
  uploadSermonFile,
  updateSermon,
  deleteSermon
} from "../controllers/sermonController.js";

const router = express.Router();

/* =========================
   🔥 IMPORTANT: SPECIFIC ROUTES FIRST
========================= */

// FILE UPLOAD (must be before /:id)
router.post("/upload", upload.single("file"), uploadSermonFile);

// CREATE
router.post("/", createSermon);

// GET ALL
router.get("/", getSermons);

// GET ONE (keep AFTER upload)
router.get("/:id", getSermonById);

// UPDATE
router.put("/:id", updateSermon);

// DELETE
router.delete("/:id", deleteSermon);

export default router;