import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessages } from '../services/messageService';
import { getSocket } from '../services/socket';
import { useUsers } from '../contexts/UserContext'
import FileTransfer from './File_transfer'

import { computeSharedSecret, encryptMessage, decryptMessage } from '../utils/cryptoUtil.js';

const Chat = () => {

    const { users, selectedUserPublicKey } = useUsers();  // Accessing users from context

    const { userEmail } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const socket = getSocket();

    const chatUser = users.find(user => user.email === userEmail);
    const [sharedSecret, setSharedSecret] = useState(null);



    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email && socket) {
            socket.emit('identify', email);
        }
    }, [socket]);


    // Generate shared secret when selected user public key is available
    useEffect(() => {

        console.log('firing computing Shared Secret on change of Public Key');


        const userPrivateKey = localStorage.getItem('privateKey');  
        let storedPublicKey = selectedUserPublicKey || localStorage.getItem('selectedUserPublicKey')

        console.log('private key', userPrivateKey)
        console.log('selectedUser Public key', storedPublicKey)
        if (userPrivateKey && storedPublicKey) {

            // Generate the shared secret between the logged-in user and the selected user
            const secret = computeSharedSecret(userPrivateKey, storedPublicKey);
            setSharedSecret(secret);
            console.log('Shared Secret:', secret);
        }
    }, [selectedUserPublicKey]);



    // Fetching messages between the logged-in user and the selected chat user

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

                    let decryptedMessage = msg.message;

                    if(msg.iv && sharedSecret){

                        try{
                            console.log('Decrypting Fetched message...')
                            decryptedMessage = decryptMessage(msg.message , msg.iv, sharedSecret)
                        }
                        catch(error)
                        {
                            console.error("error while decrypting Message" , error);
                            
                        }
                    }

                    return {
                        ...msg,
                        sender_id: msg.sender_id  === email ? 'me' : msg.sender_id,
                        message: decryptedMessage,

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
    }, [userEmail , sharedSecret]);




    // Listen for private messages
    useEffect(() => {

        const handlePrivateMessage = (data) => {

            const email = localStorage.getItem('email');

            console.log('firing Handle Private Message');

            console.log('sharedSecret', sharedSecret);

            console.log('Private message received:', data);

            let decryptedMessage = data.message;


            if (sharedSecret && data.iv) {
                try {
                    console.log("firing decryption");
                    console.log('sharedSecret', sharedSecret);
                    console.log('Data', data.message);

                    decryptedMessage = decryptMessage(data.message, data.iv, sharedSecret)
                }
                catch (error) {
                    console.error("error while decrypting the message : ", error);

                }
            }

            console.log("Current chat user:", userEmail);
            console.log("Message from:", data.senderEmail, "to:", data.receiverEmail);


            console.log('decrypted message', decryptedMessage)
            // Only append messages that are between the logged-in user and the selected chat user
            if (
                (data.senderEmail === email && data.receiverEmail === userEmail) ||
                (data.senderEmail === userEmail && data.receiverEmail === email)
            ) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        sender_id: data.senderEmail === email ? 'me' : data.senderEmail,
                        message: decryptedMessage,
                        fileName: data.fileName || null,
                        fileSize: data.fileSize || null
                    }
                ]);
            }
        };

        socket.on('private_message', handlePrivateMessage);
        socket.on('file_message', handlePrivateMessage); // Listening for file messages

        return () => {
            socket.off('private_message', handlePrivateMessage);
            socket.off('file_message', handlePrivateMessage);
        };
    }, [socket, userEmail , sharedSecret]);








    const handleSendMessage = () => {
        if (!message) {
            return;
        }

        console.log('firing Handle Send Message');

        const senderEmail = localStorage.getItem('email');
        const receiverEmail = userEmail;

        console.log('Sending message:', { senderEmail, receiverEmail, message }); // Debugging line

        const { iv, encryptedData } = encryptMessage(message, sharedSecret);
        console.log('Sending Encrypted Message:', { senderEmail, receiverEmail, encryptedData, iv });

        socket.emit('private_message', { senderEmail, receiverEmail, encryptedData, iv });

        setMessages(prevMessages => [
            ...prevMessages,
            {
                sender_id: 'me',
                message
            }
        ]);
        setMessage('');
    };

    if (!userEmail || userEmail === localStorage.getItem('email')) {
        return <div className='text-xl h-screen flex justify-center items-center'>Welcome! Please select another user to start chatting.</div>;
    }

    if (loading) {
        return <div>Loading chat...</div>;
    }




    return (
        <div className="chat-container flex flex-col">

            <h2 className="text-xl mb-4 flex justify-center">
                Chatting with {chatUser ? chatUser.fullName : 'Loading...'}
            </h2>

            <div className="messages flex-1 overflow-y-auto p-4">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`my-2 ${msg.sender_id === 'me' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-3 rounded-lg ${msg.sender_id === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                                {msg.fileName ? (
                                    <div>
                                        📁 <strong>{msg.sender_id}</strong> sent a file:
                                        <br />
                                        <span className="text-sm">{msg.fileName} ({msg.fileSize})</span>
                                    </div>
                                ) : (
                                    msg.message
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No messages yet.</div>
                )}
            </div>



            <FileTransfer
                socket={socket}
                senderEmail={localStorage.getItem('email')}
                receiverEmail={userEmail}

                onFileSent={(fileName, fileSize) => {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        {
                            sender_id: 'me',
                            fileName,
                            fileSize
                        }
                    ]);
                }}
            />


            <div className="message-input  p-4 flex items-center">

                <input
                    className="flex-1 rounded-lg p-3 mr-2 border border-gray-300"
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button
                    className="bg-blue-600 hover:bg-sky-700 text-white rounded-md px-3 py-2"
                    onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};
export default Chat;
