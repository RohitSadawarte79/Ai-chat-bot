import express from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import dotenv from 'dotenv'
dotenv.config();
import { GoogleGenAI } from "@google/genai";

import { Server } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const GEMINI_API_KEY = 'AIzaSyDVoJOcHNQipFkC7wRxfekicroqChcYnKw';

const genAI = new GoogleGenAI({apiKey : GEMINI_API_KEY});


//make the views and public folder accessable 
app.use(express.static(path.join(__dirname , '/views'))); //html
app.use(express.static(path.join(__dirname , '/public'))); // js, css, images

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html' ));
});

// we are using socke.io here
io.on('connection', (socket) => {
    console.log(`A user connected with id: ${socket.id}`);

    // 4. MAKE The callback async

    socket.on('chat message', async (text) => {
        console.log('Message received from client: ' + text);
        //we will send this text to the AI later
        
        try {
            const response = await genAI.models.generateContent({
                model : "gemini-2.5-flash",
                contents : `${text}`,
            });
            const aiText = response.text;

            console.log('AI Reply: ' + aiText);
            socket.emit('bot reply', aiText);
        } catch (error) {
            console.error('AI Error: ', error);
            socket.emit('bot reply', 'Sorry, I had trouble thinking of a reply.');
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected.`);
    });
});



server.listen(5000, () => {
    console.log('Server is running on port 5000');
});





