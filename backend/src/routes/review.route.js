import express from 'express';
import {
  addReview,
  deleteReview,
  editReview,
} from '../controller/review.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/add/:productId', protectRoute, addReview);
router.put('/edit/:productId/:reviewId', protectRoute, editReview);
router.delete('/del/:productId/:reviewId', protectRoute, deleteReview);

export default router;
