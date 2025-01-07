import React, { useEffect, useState } from "react";
import api from '../services/api'

const ChatWindow = ({ selectedUser }) => {
    const [messages, setMessage] = useState([]);

    useEffect(() => {
        if (selectedUser && selectedUser.email) {
            const fetchMessages = async () => {
                try {
                    const response = await api.get(`/message/messages?receiverEmail=${selectedUser.email}`)
                    setMessage(response.data.messages || [])
                }
                catch (error) {
                    console.error('Error fetchign message:', error);
                    setMessage([]);
                }
            }

            fetchMessages();
        }
    }, [selectedUser]);



    return (
        <div className="chat-window">
            <h2>Chat with {selectedUser ? selectedUser.email : '...'}</h2>
            <div className="messages">
                {messages && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender_email === selectedUser.email ? 'received' : 'sent'}`}>
                            {msg.message}
                        </div>
                    ))
                ) : (
                    <div>No messages yet</div>
                )}
            </div>
        </div>
    )
}


export default ChatWindow;