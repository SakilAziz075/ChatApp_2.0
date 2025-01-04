import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

//enviroment variables 
const JWT_SECRET = process.env.JWT_SECRET ; //|| 'hello';
const JWT_EXPIRATION = '1h'



//signUp handler
export const signUp = async (req, res) => {
    const { email, password } = req.body;

    try {
        //checking ig user already exist
        const [existingUser] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        //Hashing the password

        const hashedPassword = await bcrypt.hash(password, 10);

        //saving user to the DB
        await pool.query('INSERT INTO Users (email, password) VALUES (?,?)', [email, hashedPassword])

        res.status(201).json({ message: 'User registered successfully ' });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

};


//Login handler 
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //Checking if user exists
        const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [email])

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //Verify password
        const isPasswordValid = await bcrypt.compare(password, user[0].password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'invalid password' });
        }


        //Generate JWT
        const token = jwt.sign({ id: user[0].id, email: user[0].email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        res.status(200).json( {message:"Login Sucessful" , token});
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error '});
    }

};
