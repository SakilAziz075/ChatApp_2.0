import React, { useEffect, useState } from "react";
import socket from '../services/socket';

const Chat = ({ senderId, receiverId }) => {
    const [currentMessage, setCurrentMessage] = useState(''); // Renamed for clarity
    const [chatMessages, setChatMessages] = useState([]); // Renamed for clarity

    // Listen for incoming messages
    useEffect(() => {
        socket.on('receive_message', (data) => {
            if (data.receiverId === senderId)
            {
                setChatMessages((prevMessages) => [...prevMessages, data.message]);
            }
        });

    })
}