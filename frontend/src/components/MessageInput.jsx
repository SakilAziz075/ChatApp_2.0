import React ,{ useState} from "react";
import socket from '../services/socket'

const MessageInput= ( {selectedUser })=>{
    const[message , setMessage]= useState('');

    const sendMessage = async ()=>{
        
        if(selectedUser && message.trim()){

            const senderEmail = localStorage.getItem('email');
            socket.emit('private_message', { 
                senderEmail: senderEmail, 
                receiverEmail: selectedUser.email, 
                message 
            });
            setMessage('');
        }
    };

    return(
        <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    )
}

export default MessageInput;