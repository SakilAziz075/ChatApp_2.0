import { Server } from 'socket.io'
import { sendMessage as dbSendMessage } from './controller/messageController.js'
import jwt from 'jsonwebtoken';

let io;

const socketToEmail = new Map();
const emailToSocket = new Map();



export const setupSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173', // Your frontend URL
            methods: ['GET', 'POST'],
            // allowedHeaders: ['Content-Type'],
            // credentials: true,  // If using cookies/session
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

                if (err) {
                    return next(new Error('Authentication error'));
                }
                socket.user = decoded; // Attach user info to the socket
                next();
            });
        }

        else {
            next(new Error('Authentication error'));
        }
    });






    io.on('connection', (socket) => {

        console.log('User connected:', socket.id);

        
        
        socket.on('identify', (email) => {

            socketToEmail.set(socket.id, email);
            emailToSocket.set(email, socket.id);

            console.log(`User ${email} identified with socket ${socket.id}`);
            console.log('Current emailToSocket map:', emailToSocket);

        });
        

        //Handling private message
        socket.on('private_message', async (data) => {

            console.log('date: ' ,data);
            
            const { senderEmail, receiverEmail, message } = data;

            console.log('receiverEmail:' ,receiverEmail);
            

            // Finding the socket ID of the receiver by email
            const receiverSocketId = emailToSocket.get(receiverEmail);

            console.log('receiverID :' ,receiverSocketId)

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('private_message', { senderEmail, message });
            }

            try {
                const result = await dbSendMessage(senderEmail, receiverEmail, message, null);
                console.log('Private message saved to database:', result.message);

                // Emit success back to the sender
                socket.emit('message_status', { status: 'success', message: result.message });

            } 
            
            catch (error) {
                
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

            const email = socketToEmail.get(socket.id);
            
            if (email) {
                socketToEmail.delete(socket.id);
                emailToSocket.delete(email);
            }
            console.log('User disconnected:', socket.id);

        });

    });

}