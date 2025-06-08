import express from 'express';
import { updateMailStatus, getMailHistory } from '../controllers/historyController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/:mailId', verifyJWT, getMailHistory);

// Admin-only routes
router.post('/:mailId', verifyJWT, isAdmin, updateMailStatus);

export default router;