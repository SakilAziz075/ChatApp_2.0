import { Server } from 'socket.io'
import { sendMessage as dbSendMessage } from './controller/messageController.js'

let io;
const userSockets = new Map(); // To track socket ID to email mapping

export const setupSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173', // Your frontend URL
            methods: ['GET', 'POST'],
            // allowedHeaders: ['Content-Type'],
            // credentials: true,  // If you're using cookies/session
        },
    });


    io.on('connection', (socket) => {

        console.log('User connected:', socket.id);

        socket.on('identify', (email) => {
            userSockets.set(socket.id, email);
            console.log(`User ${email} identified with socket ${socket.id}`);
        });

        //Handling private message
        socket.on('private_message', async (data) => {

            const { senderEmail, receiverEmail, message } = data;

            // Finding the socket ID of the receiver by email
            const receiverSocketId = [...userSockets.entries()]
                .find(([_, email]) => email === receiverEmail)?.[0];

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('private_message', { senderEmail, message });
                }

                try {
                    const result = await dbSendMessage(senderEmail, receiverEmail, message, null);
                    console.log('Private message saved to database:', result.message);
    
                    // Emit success back to the sender
                    socket.emit('message_status', { status: 'success', message: result.message });
                } catch (error) {
                    console.error('Error saving private message', error);
                    socket.emit('message_status', { status: 'error', message: 'Error sending private message' });
                }
            });

        

        //Handle group message
        socket.on('group_message', async (data) => {

            const { senderEmail, message, groupId } = data;

            io.to(groupId).emit('group_message', { senderEmail, groupId, message });
            
            try {
                const result = await dbSendMessage(senderEmail, null, message, groupId);
                console.log('Group message saved to database');

                // Emit status back to sender
                socket.emit('message_status', { status: 'success', message: result.message });

            }

            catch (error) {
                console.error('Error in saving group message', error);
                socket.emit('message_status', { status: 'error', message: 'Error sending group message' });
            }
        });


        
        // Listen for users joining a group
        socket.on('join_group', (groupId) => {
            socket.join(groupId);
            console.log(`User joined group ${groupId}`);
        });

        // Listen for users leaving a group
        socket.on('leave_group', (groupId) => {
            socket.leave(groupId);
            console.log(`User left group ${groupId}`);
        });



        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

    });

}