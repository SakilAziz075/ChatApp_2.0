import React, { useEffect, useState } from "react";
import api from '../services/api';

const Sidebar = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/user/profile');
                console.log(response.data); // Log the response to verify its structure
                setUsers(response.data.users || []); // Ensure it's always an array
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="sidebar">
            <h2>Users</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} onClick={() => onSelectUser(user)}>
                            {user.email}
                        </li>
                    ))
                ) : (
                    <li>No users available</li> // Fallback message when no users are available
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
