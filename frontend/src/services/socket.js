// src/services/socket.js
import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    // Initialize the socket connection
    socket = io('https://localhost:3000', { // Replace with your backend URL
      auth: {
        token: localStorage.getItem('token'), // Attach JWT token for authentication
      },
    });

    // Handle reconnection and other socket events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  return socket;
};
