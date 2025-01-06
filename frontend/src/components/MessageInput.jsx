import React ,{ useState} from "react";
import api from '../services/api'

const MessageInput= ( {selectedUser })=>{
    const[message , setMessage]= useState('');

    const sendMessage = async ()=>{
        
        if(selectedUser && message.trim()){
            try {
                await api.post('/message/messages' , {receiverId:selectedUser.id , message});
                setMessage('');
            } 
            catch (error) {
                console.error('Error sending message:' , error);
            }
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