import React, { useState } from 'react';
import './GroupModal.css';

const GroupModal = ({ isOpen, onClose, mode }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');

  const handleCreateGroup = (e) => {
    e.preventDefault();

    const memberEmails = members
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email);

    // Send to backend or context logic
    console.log('Creating group:', {
      groupName,
      members: memberEmails,
    });

    // Reset form
    setGroupName('');
    setMembers('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{mode === 'create' ? 'Create New Group' : 'Manage Group'}</h2>
        <form onSubmit={handleCreateGroup} className="modal-form">
          <label>Group Name:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />

          <label>Members (comma-separated emails):</label>
          <textarea
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            placeholder="example1@gmail.com, example2@gmail.com"
            required
          />

          <div className="modal-buttons">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
