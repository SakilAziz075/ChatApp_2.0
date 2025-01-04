import { io } from 'socket.io-client';

// Connecting to the backend WebSocket server
const socket = io('http://localhost:3000');

export default socket;
