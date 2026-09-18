import express from 'express';
import { getExercises, getExerciseById } from '../controllers/exerciseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Exercises library requires authentication
router.use(protect);

router.get('/', getExercises);
router.get('/:id', getExerciseById);

export default router;
