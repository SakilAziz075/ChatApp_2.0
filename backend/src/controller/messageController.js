import pool from '../config/db.js'

//controller for fetching message
export const getMessage = async (req , res) =>{

    const userId = req.user.id //extract user ID from the authenticated user

    try 
    {
        //Query to fetch message for the authenticate user
        const [message]= await pool.query(
            'SELECT * FROM Messages WHERE sender_id = ? OR receiver_id = ? ORDER BY sent_at DESC',
            [userId , userId]
        );   

        res.status(200).json( { message })
    } 
    catch (error) {
        console.error(error);
        res.status(500).json( { message:'Server Error '});
    }

};


//Controller for sending a message
export const sendMessage = async (req, res) =>{

    const { receiverId , message } = req.body;
    const sender_id = req.user.id   // Extract sender's ID from authenticated user

    try{
        await pool.query(
            'INSERT INTO Messages (sender_id , receiver_id , message) VALUES (?,?,?)',
            [sender_id,receiverId,message]
        );

        res.status(201).json( {message: 'Message sent successfully'});
    }

    catch(error)
    {
        console.error(error);
        res.status(500).json( {message:'Server Error'})
        
    }

};