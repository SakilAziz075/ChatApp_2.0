// Import the Socket.IO client
import { io } from 'socket.io-client';

// Connect to your Socket.IO server
const socket = io('http://localhost:3000');  // Make sure this is the correct server URL

// Event listener to receive private messages
socket.on('private_message', (data) => {
  console.log('Private message received:', data);
});

// Event listener to receive group messages
socket.on('group_message', (data) => {
  console.log('Group message received:', data);
});

// Function to simulate sending a private message
const sendPrivateMessage = (senderId, receiverId, message) => {
  socket.emit('private_message', { senderId, receiverId, message });
  console.log('Private message sent:', message);
};

// Function to simulate sending a group message
const sendGroupMessage = (senderId, groupId, message) => {
  socket.emit('group_message', { senderId, groupId, message });
  console.log('Group message sent:', message);
};

// Simulate sending a private message
sendPrivateMessage(1, 2, 'Hello, User 2!');

// Simulate sending a group message with a correct groupId type (numeric)
sendGroupMessage(1, 1, 'Hello, everyone in the group!'); // Using the integer 1 for groupId
