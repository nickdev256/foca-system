import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { summary, roleReport } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", protect, summary);
router.get("/reports/overview", protect, roleReport);

export default router;