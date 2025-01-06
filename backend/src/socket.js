import { Server } from 'socket.io'
import { sendMessage as dbSendMessage } from './controller/messageController.js'

let io;

export const setupSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: 'https://localhost:5173', //React URL
            method: ['GET', 'POST',]
        },
    });


    io.on('connection', (socket) => {

        console.log('User connected:', socket.id);

        //Handling private message
        socket.on('private_message', async (data) => {

            const { senderId, receiverId, message } = data;

            io.to(receiverId).emit('private_message', { senderId, message });

            try {
                const result = await dbSendMessage(senderId, receiverId, message, null)
                console.log('Private message saved to database' ,result.message);
                
                // Emit success back to the sender
                socket.emit('message_status', { status: 'success', message: result.message });
            }

            catch (error) {
                console.error('Error in saving private message', error);
                socket.emit('message_status', { status: 'error', message: 'Error sending private message' });
            }
        });

        

        //Handle group message
        socket.on('group_message', async (data) => {

            const { senderId, message, groupId } = data;

            io.to(groupId).emit('group_message', { senderId, groupId, message });

            try {
                const result = await dbSendMessage(senderId, null, message, groupId);
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