import dotenv from 'dotenv'
import https from 'https'
import fs from 'fs'
import app from './app.js'
import { setupSocket } from './socket.js'

dotenv.config();

const PORT = process.env.PORT || 3443; // Using my HTTPS port

//Loading SSL certificate 
const sslOptions = {
    key: fs.readFileSync('./cert/server.key'),
    cert: fs.readFileSync('./cert/server.crt')
};


//Create HTTPS server
const server = https.createServer(sslOptions, app);

//Setup WebSocket
setupSocket(server);

server.listen(PORT, ()=>{
    console.log(`Server running  on https://localhost:${PORT}`);
});