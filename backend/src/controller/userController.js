import pool from '../config/db.js';

// Controller for fetching user profile
export const getUserProfile = async (req, res) => {

    const userId = req.user.id;  // Extract user ID from the authenticated user

    try {
        // Query to get the user details
        const [user] = await pool.query('SELECT id, email, created_at FROM Users WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: user[0] });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
