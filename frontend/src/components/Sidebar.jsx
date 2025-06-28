import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useUsers } from '../contexts/UserContext';
import './Sidebar.css';

const Sidebar = () => {
  const { users, loading, setSelectedUserPublicKey } = useUsers();
  const [activeTab, setActiveTab] = useState('contacts');

  const handleUserClick = (user) => {
    localStorage.setItem('selectedUserPublicKey', user.publicKey);
    setSelectedUserPublicKey(user.publicKey);
    console.log("Selected User Public Key: ", user.publicKey);
  };

  if (loading) {
    return <div className="w-80 bg-gray-900 text-white p-4">Loading users...</div>;
  }

  return (
    <div className="sidebar">
      {/* Profile */}
      <div className="sidebar-profile">
        <div className="profile-avatar">U</div>
        <div className="profile-info">
          <h3>Your Name</h3>
          <p>Click to edit profile</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
        >
          Contacts
        </button>
        <button className="tab-button disabled" disabled>
          Groups
        </button>
      </div>

      {/* Contact List */}
      <div className="sidebar-list">
        {users.map((user) => (
          <Link
            to={`/chat/${user.email}`}
            key={user.email}
            onClick={() => handleUserClick(user)}
            className="chat-item"
          >
            <div className="avatar-container">
              <div className="avatar">{user.fullName?.[0] || 'U'}</div>
              <span className="online-dot" />
            </div>
            <div className="chat-info">
              <div className="chat-name">{user.fullName}</div>
              <div className="chat-subtext">Click to chat</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
