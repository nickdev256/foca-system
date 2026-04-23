import express from "express";
import { generateSermonFile } from "../controllers/aiController.js";

const router = express.Router();

router.post("/sermon-slides", generateSermonFile);

export default router;