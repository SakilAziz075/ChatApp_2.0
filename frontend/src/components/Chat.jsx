// Custom Chat UI with real-time file transfer and auto-scroll
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessages } from '../services/messageService';
import { getSocket } from '../services/socket';
import { uploadFileInChunks } from '../services/fileUploader';
import { useUsers } from '../contexts/UserContext';
import { computeSharedSecret, encryptMessage, decryptMessage } from '../utils/cryptoUtil';
import { Send, Paperclip } from 'lucide-react';


import './Chat.css'

const Chat = () => {
  const { users, selectedUserPublicKey } = useUsers();
  const { userEmail } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socket = getSocket();
  const chatUser = users.find(user => user.email === userEmail);
  const [sharedSecret, setSharedSecret] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const bottomRef = useRef(null);
  const fileBufferRef = useRef(new Map());

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email && socket) socket.emit('identify', email);
  }, [socket]);

  useEffect(() => {
    const userPrivateKey = localStorage.getItem('privateKey');
    const storedPublicKey = selectedUserPublicKey || localStorage.getItem('selectedUserPublicKey');
    if (userPrivateKey && storedPublicKey) {
      const secret = computeSharedSecret(userPrivateKey, storedPublicKey);
      setSharedSecret(secret);
    }
  }, [selectedUserPublicKey]);

  useEffect(() => {
    if (!userEmail) return;
    const getMessages = async () => {
      try {
        const rawMessages = await fetchMessages(userEmail);
        const email = localStorage.getItem('email');
        const updatedMessages = rawMessages
          .filter(msg =>
            (msg.sender_id === email && msg.receiver_id === userEmail) ||
            (msg.sender_id === userEmail && msg.receiver_id === email))
          .map(msg => {
            let decrypted = msg.message;
            if (msg.iv && sharedSecret) {
              try {
                decrypted = decryptMessage(msg.message, msg.iv, sharedSecret);
              } catch (err) {
                console.error('Decryption failed', err);
              }
            }
            return {
              id: msg.id,
              sender: msg.sender_id === email ? 'me' : msg.sender_id,
              content: decrypted,
              timestamp: new Date(msg.timestamp || Date.now()),
              type: msg.fileName ? 'file' : 'text',
              fileData: msg.fileName ? {
                name: msg.fileName,
                size: msg.fileSize,
                url: '#' // optional placeholder
              } : null,
              isOwn: msg.sender_id === email
            };
          });
        setMessages(updatedMessages);
      } catch (err) {
        console.error('Fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [userEmail, sharedSecret]);

  useEffect(() => {
    const handlePrivateMessage = (data) => {
      const email = localStorage.getItem('email');
      let decrypted = data.message;
      if (data.iv && sharedSecret) {
        try {
          decrypted = decryptMessage(data.message, data.iv, sharedSecret);
        } catch (err) {
          console.error('Runtime decryption error', err);
        }
      }
      if (
        (data.senderEmail === email && data.receiverEmail === userEmail) ||
        (data.senderEmail === userEmail && data.receiverEmail === email)
      ) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: data.senderEmail === email ? 'me' : data.senderEmail,
          content: decrypted,
          timestamp: new Date(),
          type: data.fileName ? 'file' : 'text',
          fileData: data.fileName ? {
            name: data.fileName,
            size: data.fileSize,
            url: '#'
          } : null,
          isOwn: data.senderEmail === email
        }]);
      }
    };
    socket.on('private_message', handlePrivateMessage);
    socket.on('file_message', handlePrivateMessage);
    return () => {
      socket.off('private_message', handlePrivateMessage);
      socket.off('file_message', handlePrivateMessage);
    };
  }, [socket, sharedSecret, userEmail]);

  useEffect(() => {
    const handleFileChunk = (data) => {
      const { senderEmail, fileName, chunk, isLastChunk, fileSize } = data;
      const bufferMap = fileBufferRef.current;
      const buffer = bufferMap.get(fileName) || [];
      buffer.push(chunk);
      bufferMap.set(fileName, buffer);

      if (isLastChunk) {
        const completeBlob = new Blob(buffer);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: senderEmail === localStorage.getItem('email') ? 'me' : senderEmail,
            content: fileName,
            timestamp: new Date(),
            type: 'file',
            fileData: {
              name: fileName,
              size: fileSize,
              url: URL.createObjectURL(completeBlob)
            },
            isOwn: senderEmail === localStorage.getItem('email')
          }
        ]);
        bufferMap.delete(fileName);
      }
    };
    socket.on('file_chunk', handleFileChunk);
    return () => {
      socket.off('file_chunk', handleFileChunk);
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const senderEmail = localStorage.getItem('email');
    const receiverEmail = userEmail;
    const { iv, encryptedData } = encryptMessage(message, sharedSecret);
    socket.emit('private_message', { senderEmail, receiverEmail, encryptedData, iv });
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'me',
      content: message,
      timestamp: new Date(),
      type: 'text',
      isOwn: true
    }]);
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setTimeout(() => handleFileUpload(file), 200);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    uploadFileInChunks({
      socket,
      file,
      receiverEmail: userEmail,
      onProgress: (progress) => setUploadProgress(progress),
      onComplete: (fileName, fileSize) => {
        setIsUploading(false);
        setSelectedFile(null);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'me',
            content: fileName,
            timestamp: new Date(),
            type: 'file',
            fileData: {
              name: fileName,
              size: fileSize,
              url: URL.createObjectURL(file)
            },
            isOwn: true
          }
        ]);
      }
    });
  };

  const formatFileSize = (size) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return +(size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
  };

  if (!userEmail || userEmail === localStorage.getItem('email')) {
    return <div className="flex items-center justify-center h-full text-xl">Select a user to start chatting</div>;
  }

  return (
<div className="chat-container">
  <div className="chat-header">
    <div className="chat-user-info">
      <div className="chat-user-avatar">
        {chatUser?.fullName?.[0]}
      </div>
      <div>
        <h2 className="chat-user-name">{chatUser?.fullName}</h2>
        <p className="chat-user-status">{chatUser?.isOnline ? 'Online' : 'Offline'}</p>
      </div>
    </div>
  </div>

  <div className="chat-messages" id="chat-scroll">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`chat-message ${msg.isOwn ? 'own' : 'other'}`}
      >
        <div className="chat-bubble">
          {msg.type === 'file' ? (
            <div>
              <p className="file-title">📁 {msg.fileData.name}</p>
              <a href={msg.fileData.url} download={msg.fileData.name} className="file-download">
                Download ({msg.fileData.size})
              </a>
            </div>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      </div>
    ))}
    <div ref={bottomRef} />
  </div>

  <div className="chat-input-area">
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: 'none' }}
  />

  <button className="chat-icon-btn" onClick={() => fileInputRef.current?.click()}>
    <Paperclip size={20} />
  </button>

  <input
    type="text"
    placeholder="Type a message..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
    className="chat-text-input"
  />

  <button className="chat-send-btn" onClick={handleSendMessage}>
    <Send size={20} />
  </button>
</div>


  {isUploading && (
    <div className="upload-status">
      Uploading: {uploadProgress}%
      <progress value={uploadProgress} max="100"></progress>
    </div>
  )}
</div>
  );
};

export default Chat;
