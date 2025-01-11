import React, { useEffect , useState } from "react";
import { Link} from 'react-router-dom'
import { useUsers } from '../contexts/UserContext';

const Sidebar = ()=>{

    const { users, loading } = useUsers();

        if (loading) {
            return <div className="w-64 bg-gray-800 text-white p-4">Loading users...</div>;
        }

        return (
            <div className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Users</h2>
                <ul className="space-y-2">
                    {users.map(user => (
                        <li key={user.email}>
                            <Link to={`/chat/${user.email}`} className="block p-2 rounded hover:bg-gray-700">
                                {user.fullName}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };


    export default Sidebar;