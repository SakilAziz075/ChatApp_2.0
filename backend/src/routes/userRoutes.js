import express from 'express'
import authenticateJWT from '../middleware/authMiddleware.js'
import { getAllUsers } from '../controller/userController.js'
import { uploadProfilePic } from '../controller/uploadProfilePic.js'

const router = express.Router()

//Route to fetch user's profile - protected
router.get('/profile', authenticateJWT, getAllUsers);
router.post('/upload-profile-pic', authenticateJWT, uploadProfilePic);

export default router;