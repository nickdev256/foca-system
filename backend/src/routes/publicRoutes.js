import express from 'express';
import { getPublicSummary } from '../controllers/publicController.js';

const router = express.Router();

router.get('/dashboard/public-summary', getPublicSummary);

export default router;