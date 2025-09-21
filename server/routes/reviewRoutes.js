import express from 'express';
import { addReview, getReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/:companyId', addReview);
router.get('/:companyId', getReviews);

export default router;
