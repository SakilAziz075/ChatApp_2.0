import pool from '../config/db.js'
import multer from 'multer';
import fs from 'fs';

// Ensure directory exists
const uploadDir = 'public/uploads/profilePics';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//Setting up mutler storage

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profilePics');
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage}).single('profilePic');

export const uploadProfilePic =( req , res)=>{

    upload(req, res , async (err)=>{
        if(err)
            return res.status(500).json({message: 'File Upload failed'});

        const {id} = req.user;
        const profilePic = `/uploads/profilePics/${req.file.filename}`;

        try {
            await pool.query('UPDATE Users SET profilePic = ? WHERE id = ?' , [profilePic,id])
            res.status(200).json({message : 'Profile Picture update' , profilePic})
        } 
        
        catch (error) {
            console.error(error)   
            res.status(500).json({message: 'Database update failed'})
        }

    })

}