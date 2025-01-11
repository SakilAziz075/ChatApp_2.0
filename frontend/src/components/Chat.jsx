import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessages } from '../services/messageService';
import { getSocket } from '../services/socket';
import { useUsers } from '../contexts/UserContext'

const Chat = () => {

    const { users } = useUsers();  // Accessing users from context
    const { userEmail } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = getSocket();

    const chatUser = users.find(user => user.email === userEmail);




    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email && socket) {
            socket.emit('identify', email);
        }
    }, [socket]);




    useEffect(() => {

        if (!userEmail) return;

        const getMessages = async () => {
            try {

                const messages = await fetchMessages(userEmail);
                console.log('Fetched messages:', messages);

                const email = localStorage.getItem('email');

                console.log('login as :', email);
                console.log('selected user', userEmail);


                const updatedMessages = messages.filter(msg =>
                    (msg.sender_id === email && msg.receiver_id === userEmail) ||
                    (msg.sender_id === userEmail && msg.receiver_id === email)
                ).map(msg => {
                    return {
                        ...msg,
                        sender_id: msg.sender_id === email ? 'me' : msg.sender_id
                    };
                });

                console.log("Updated Messages:", updatedMessages);
                setMessages(updatedMessages);
            }

            catch (error) {
                console.error('Error fetching messages:', error);
            }

            finally {
                setLoading(false);
            }
        };

        getMessages();
    }, [userEmail]);



    // Listen for private messages
    useEffect(() => {

        const handlePrivateMessage = (data) => {

            const email = localStorage.getItem('email');

            console.log('Private message received:', data);


            // Only append messages that are between the logged-in user and the selected chat user
            // if (
            //     (data.senderEmail === email && data.receiverEmail === userEmail) ||
            //     (data.senderEmail === userEmail && data.receiverEmail === email)
            // ) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        sender_id: data.senderEmail === email ? 'me' : data.senderEmail,
                        message: data.message
                    }
                ]);
            // }
        };

        socket.on('private_message', handlePrivateMessage);

        return () => {
            socket.off('private_message', handlePrivateMessage);
        };
    }, [socket, userEmail]);








    const handleSendMessage = () => {
        if (!message) return;

        const senderEmail = localStorage.getItem('email');
        const receiverEmail = userEmail;

        console.log('Sending message:', { senderEmail, receiverEmail, message }); // Debugging line
        socket.emit('private_message', { senderEmail, receiverEmail, message });

        setMessages(prevMessages => [
            ...prevMessages,
            { 
                sender_id: 'me', 
                message 
            }
        ]);
        setMessage('');
    };



    if (loading) {
        return <div>Loading chat...</div>;
    }




    return (
        <div className="chat-container">
            <h2 className="text-xl mb-4">
                Chatting with {chatUser ? chatUser.fullName : 'Loading...'}
            </h2>
            <div className="messages">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={msg.sender_id === 'me' ? 'text-right' : 'text-left'}>
                            <div className={`message ${msg.sender_id === 'me' ? 'sent' : 'received'}`}>
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
