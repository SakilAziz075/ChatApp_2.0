import {Server} from 'socket.io'

export const setupSocket = (server)=>{

    const io = new Server(server, {
        cors:{
            origin:'https://localhost:5173', //React URL
            method:['GET', 'POST',]
        },
    });


    io.on('connection' , (socket)=>{
        console.log('New Client connected:', socket.id);


        //Listening for the 'send_message' event from the client
        socket.on('send_message',(data)=>{
            const { senderId , receiverId , message } = data ;
            
            //Broadcasting the message to the specific user (receiver)
            io.to(receiverId).emit('receive_message', {senderId , message});
            console.log('Message Sent: ' , message);
        });

        //handle disconnection 
        socket.on('disconnect',()=>{
            console.log('Client disconnected:' ,socket.id);
        });
    });

}