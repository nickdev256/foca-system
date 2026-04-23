import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getSuperAdminSummary } from '../controllers/superAdminController.js';

const router = express.Router();

router.get('/summary', protect, authorize('super_admin'), getSuperAdminSummary);

export default router;