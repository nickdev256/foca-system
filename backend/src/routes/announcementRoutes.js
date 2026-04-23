import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  approveAnnouncement,
  markAsSeen,
  getPendingAnnouncements,
} from "../controllers/announcementController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
