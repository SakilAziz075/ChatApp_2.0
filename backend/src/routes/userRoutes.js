import express from 'express'
import authenticateJWT from '../middleware/authMiddleware.js'
import { getUserProfile } from '../controller/userController.js'

const router = express.Router()

//Route to fetch user's profile - protected
router.get('/profile', authenticateJWT, getUserProfile);

export default router;