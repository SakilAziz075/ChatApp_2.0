import pool from '../config/db'

export const addUserToGroup = async (req, res)=>{
    
    const {groupId , userEmail } = req.body
    const admin = req.user.email;

    try{
        const [existingGroup] = await pool.query(
            'SELECT * FROM Groups WHERE id =?' , 
            [groupId])

        if(existingGroup.length===0)
        {
            return res.status(404).json({ message: 'Group not found'});
        }


        const [adminCheck] = await pool.query(
            'SELECT * FROM GroupAdmins WHERE group_id = ? AND admin_id = ?',
            [groupId, adminEmail]
        )

        if (adminCheck.length === 0) {
            return res.status(403).json({ message: 'Only admins can add members to the group' });
        }


        // Check if the user already belongs to the group
        const [existingMembership] = await pool.query(
            'SELECT * FROM GroupMembers WHERE group_id = ? AND user_id = ?',
            [groupId, userEmail]
        );
        if (existingMembership.length > 0) {
            return res.status(400).json({ message: 'User is already a member of the group' });
        }


        // Add the user to the group
        await pool.query('INSERT INTO GroupMembers (group_id, user_id) VALUES (?, ?)', [groupId, userEmail]);
        res.status(201).json({ message: 'User added to group successfully' });

    }

    
    catch(error)
    {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
    
};