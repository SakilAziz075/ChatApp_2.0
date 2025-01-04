import express from 'express';
import authenticateJWT from '../middleware/authMiddleware.js'
import { getMessage , sendMessage } from '../controller/messageController.js'

const router = express.Router()

//Route to fetch message - protected
router.get('/messages', authenticateJWT,getMessage);

////Route to send message - protected
router.post('/messages', authenticateJWT,sendMessage);

export default router;