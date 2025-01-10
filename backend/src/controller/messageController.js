import pool from '../config/db.js'

//controller for fetching message 
export const getMessage = async (req , res) =>{

    const userEmail = req.user.email //extract user ID from the authenticated user
    const { groupId } = req.query;

    try 
    {
        let query = '';
        let values = [];

        if(groupId){
            query = 'SELECT * FROM GroupMessages WHERE group_id = ? ORDER BY sent_at ASC';
            values = [groupId];
        }

        else{
            query = 'SELECT * FROM Messages WHERE sender_id = ? OR receiver_id = ? ORDER BY sent_at ASC';
            values = [userEmail, userEmail];
        }

    const [message]= await pool.query( query , values );   

        res.status(200).json( { message })
    } 

    catch (error) {
        console.error(error);
        res.status(500).json( { message:'Server Error '});
    }

};


//Controller for sending a message
export const sendMessage = async (senderId, receiverId, message, groupId) =>{

    try{

        if (groupId)
        {
           await pool.query(
            'INSERT INTO GroupMessages (group_id , sender_id , message) VALUES(?,?,?)',
            [groupId, senderId , message]
           );
        }
        
        else {
            await pool.query(
                'INSERT INTO Messages (sender_id , receiver_id , message) VALUES (?,?,?)',
                [senderId,receiverId,message]
            );
        }

        return { success: true, message: 'Message sent and saved successfully' };
    }

    catch(error)
    {
        console.error(error);
        return { success: false, message: 'Error saving message' };    
    }

};