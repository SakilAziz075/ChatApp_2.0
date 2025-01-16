import pool from '../config/db'

export const leaveGroup = async (req,res)=>{

    const {groupId} = req.body;
    const userEmail = req.user.email

    try{    

        const [adminCheck] = await pool.query(
            'SELECT * FROM GroupAdmins WHERE group_id = ? AND admin_id = ?',
            [groupId, userEmail]
        )    
    
        if (adminCheck.length > 0) {
            // If the user is an admin, delete the group
            await pool.query('DELETE FROM Groups WHERE id = ?', [groupId]);
            await pool.query('DELETE FROM GroupMembers WHERE group_id = ?', [groupId]);
            await pool.query('DELETE FROM GroupMessages WHERE group_id = ?', [groupId]);
            await pool.query('DELETE FROM GroupAdmins WHERE group_id = ?', [groupId]);
            return res.status(200).json({ message: 'Group deleted as admin left' });
        }

        // If not an admin, remove the user from the group
        await pool.query('DELETE FROM GroupMembers WHERE group_id = ? AND user_id = ?', [groupId, userEmail]);
    
        res.status(200).json({ message: 'User left the group successfully' });
    }   
    catch(error)
    {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
        
    }
}