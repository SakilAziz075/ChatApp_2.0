import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { useUsers } from '../contexts/UserContext';

const Sidebar = () => {

    const { users, loading , setSelectedUserPublicKey } = useUsers();


    const handleUserClick = (user) => {

        localStorage.setItem('selectedUserPublicKey', user.publicKey); //Handle resetting the page , sharedSecret comes NULL bug
        setSelectedUserPublicKey(user.publicKey);
        console.log("Selected User Public Key: ", user.publicKey);
    }


    if (loading) {
        return <div className="w-1/3 bg-gray-800 text-white p-4">Loading users...</div>;
    }

    return (
        <div className="w-1/3 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Chats</h2>

            <ul className="space-y-2">
                {users.map(user => (
                    <li key={user.email}>
                        <Link
                            to={`/chat/${user.email}`}
                            className="block p-5 rounded-2xl bg-gray-900 hover:bg-gray-700"
                            onClick={() => handleUserClick(user)} // Handle user click to fetch their public key
                        >
                            {user.fullName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default Sidebar;