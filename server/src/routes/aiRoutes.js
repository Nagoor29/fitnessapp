import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  suggestWorkout,
  acceptSuggestion,
  getSuggestions,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiter for AI suggestion generation (max 15 requests per 10 min window per IP)
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI generation requests in a short time. Please wait a few minutes before requesting another suggestion.',
  },
});

// All AI endpoints require authentication
router.use(protect);

router.post('/suggest-workout', aiLimiter, suggestWorkout);
router.post('/suggestions/:id/accept', acceptSuggestion);
router.get('/suggestions', getSuggestions);

export default router;
