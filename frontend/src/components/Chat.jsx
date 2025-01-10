import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessages } from '../services/messageService';
import { getSocket } from '../services/socket';

const Chat = () => {
    const { userEmail } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = getSocket();

    console.log('userEmail', userEmail);
    


    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email && socket) {
            socket.emit('identify', email);
        }
    }, [socket]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const messages = await fetchMessages(userEmail);
                setMessages(messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        getMessages();

        // Listen for private messages
        socket.on('private_message', (data) => {

            console.log('Private message received:', data);

            setMessages(prevMessages => [
                ...prevMessages,
                { senderEmail: data.senderEmail, message: data.message }
            ]);
            
        });

        return () => {
            socket.off('private_message'); // Clean up the event listener when component unmounts
        };


    }, [userEmail]);




    const handleSendMessage = () => {
        if (!message) return;

        const senderEmail = localStorage.getItem('email');
        const receiverEmail = userEmail;

        console.log('Sending message:', { senderEmail, receiverEmail, message }); // Debugging line
        socket.emit('private_message', { senderEmail, receiverEmail, message });

        setMessages(prevMessages => [
            ...prevMessages,
            { senderEmail: 'me',message }
        ]);
        setMessage('');
    };

    if (loading) {
        return <div>Loading chat...</div>;
    }

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={msg.senderEmail === 'me' ? 'text-right' : 'text-left'}>
                            <div className={`message ${msg.senderEmail === 'me' ? 'sent' : 'received'}`}>
                                you are currently chatting with {userEmail}
                                {msg.message}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No messages yet.</div>
                )}
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
