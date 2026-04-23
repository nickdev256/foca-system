import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBudgetRequest,
  deleteBudgetRequest,
  getBudgetRequestById,
  getBudgetRequests,
  reviewBudgetRequest,
  updateBudgetRequest,
} from "../controllers/budgetRequestController.js";

const router = express.Router();

router.get("/", protect, getBudgetRequests);
router.post("/", protect, createBudgetRequest);
router.get("/:id", protect, getBudgetRequestById);
router.put("/:id", protect, updateBudgetRequest);
router.patch("/:id/review", protect, reviewBudgetRequest);
router.delete("/:id", protect, deleteBudgetRequest);

export default router;