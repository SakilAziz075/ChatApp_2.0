import dotenv from 'dotenv'
import http from 'http'
import app from './app.js'
import { setupSocket } from './socket.js'

dotenv.config();

const PORT = process.env.PORT || 3000;

//Create HTTP server
const server = http.createServer(app);

//Setup WebSocket
setupSocket(server);

server.listen(PORT, ()=>{
    console.log(`Server running  on http://localhost:${PORT}`);
});