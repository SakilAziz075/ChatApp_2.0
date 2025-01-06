import React , {useEffect , useState} from "react";
import api from '../services/api'

const ChatWindow= ( {selectedUser})=>{
    const [messages ,setMessage] = useState([]);

    useEffect( ()=>{
        if(selectedUser && selectedUser.id)
        {
            const fetchMessages = async ()=>{
                try {
                    const response = await api.get(`/message/messages?receiverId=${selectedUser.id}`)
                    setMessage(response.data.messages || [])
                } 
                catch (error) {
                    console.error('Error fetchign message:', error);
                    setMessages([]);
                }
            }

            fetchMessages();
        }
    } , [selectedUser]);



return(
  <div className="chat-window">
  <h2>Chat with {selectedUser ? selectedUser.email : '...'}</h2>
  <div className="messages">
      {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender_id === selectedUser.id ? 'received' : 'sent'}`}>
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