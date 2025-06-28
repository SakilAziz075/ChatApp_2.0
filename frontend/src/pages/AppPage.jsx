import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import GroupModal from '../components/GroupModal';
import { UserProvider } from '../contexts/UserContext';
import { Plus, LogOut } from 'lucide-react';
import { handleLogout, handleNewGroup } from '../utils/userAction';
import './AppPage.css'; 

const AppPage = () => {
  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <UserProvider>
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <div className="main-content">
          {/* Top Action Bar */}
          <div className="topbar">
            <h1 className="app-title">Chat Application</h1>
            <div className="topbar-buttons">
              <button className="icon-button" onClick={() => handleNewGroup(setShowGroupModal)}>
                <Plus size={16} />
                <span>Create Group</span>
              </button>
              <button className="icon-button logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            <Chat />
          </div>
        </div>

        {/* Group Modal */}
        <GroupModal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)} />
      </div>
    </UserProvider>
  );
};

export default AppPage;
