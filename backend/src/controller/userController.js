import pool from '../config/db.js';

// Controller to fetch all users
export const getAllUsers = async (req, res) => {
    const userId = req.user.email; // Extract user ID from the authenticated user

    try {
        // Query to get all users, excluding the currently authenticated user
        const [users] = await pool.query('SELECT id, email, created_at FROM Users WHERE id != ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ users });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
