import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { Server } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const server = http.createServer(app);

const io = new Server(server);


app.use(express.static(path.join(__dirname , '/views'))); //html
app.use(express.static(path.join(__dirname , '/public'))); // js, css, images


// we are using socke.io here
io.on('connection', (socket) => {
    console.log('A user connected');

    //Listen for the 'chat message' event from the client

    socket.on('chat message', (text) => {
        console.log('Message received from client: ' + text);
        //we will send this text to the AI later
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html' ));
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});





