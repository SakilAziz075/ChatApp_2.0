import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

//enviroment variables 
const JWT_SECRET = process.env.JWT_SECRET ; //|| 'hello';
const JWT_EXPIRATION = '7d'



//signUp handler
export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check if user already exists
        const [existingUser] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        await pool.query('INSERT INTO Users (fullName, email, password) VALUES (?, ?, ?)', [fullName, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



//Login handler 
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user[0].password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user[0].id, email: user[0].email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user[0].id,
                fullName: user[0].fullName,
                email: user[0].email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



export const logout = (req, res) => {
    try {
        res.clearCookie('jwt'); // Clear the JWT cookie
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


