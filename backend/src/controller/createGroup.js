import pool from '../config/db.js'

export const createGroup = async(req,res)=>{

    const {groupName} = req.body
    const creatorEmail = req.user.email


    try {
        
        const [result] = await pool.query(
            'INSERT INTO Groups(name, created_by) VALUES (?,?)',
            [groupName, creatorEmail]
        )

        // Get the inserted group ID 
        // MYSQL return the auto_inc as meta-data
        const groupId = result.insertId;    


        // assigning the creator as the admin of the group
        await pool.query(
            'INSERT INTO GroupAdmins (group_id, admin_id) VALUES (?, ?)',
            [groupId, creatorEmail]
        );

        res.status(201).json({ message: 'Group created successfully', groupId });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

}