import express from 'express';
import { submitMail, getAllMails, getMailsByUser, getMailDetails, getMailStats, getMailTemplate } from '../controllers/mailController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { isAdmin, isUser } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/', verifyJWT, isUser, submitMail);
router.get('/user', verifyJWT, getMailsByUser);
router.get('/details/:mailId', verifyJWT, getMailDetails);
router.get('/template', verifyJWT, getMailTemplate);

// Admin-only routes
router.get('/', verifyJWT, isAdmin, getAllMails);
router.get('/stats', verifyJWT, isAdmin, getMailStats);

export default router;

