
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="chat-page">
      <Sidebar onSelectUser={setSelectedUser} />
      {selectedUser && (
        <>
          <ChatWindow selectedUser={selectedUser} />
          <MessageInput selectedUser={selectedUser} />
        </>
      )}
    </div>
  );
};

export default ChatPage;
