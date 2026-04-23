import express from 'express';
import {
  subscribeNewsletter,
  getSubscribers,
  unsubscribeNewsletter,
} from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.get('/', getSubscribers);
router.patch('/unsubscribe', unsubscribeNewsletter);

export default router;