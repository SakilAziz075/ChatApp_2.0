import express from 'express'
import authenticateJWT from '../middleware/authMiddleware.js'
import { getAllUsers } from '../controller/userController.js'

const router = express.Router()

//Route to fetch user's profile - protected
router.get('/profile', authenticateJWT, getAllUsers);

export default router;