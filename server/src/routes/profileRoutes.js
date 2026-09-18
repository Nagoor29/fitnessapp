import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All profile endpoints require authentication
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile)
  .post(updateProfile);

export default router;
