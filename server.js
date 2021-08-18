import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './routes/user.js';
import locationRouter from './routes/location.js';
import chatroomRouter from './routes/chatroom.js';
import chatRouter from './routes/chat.js';
import config from './config.js';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./images'));


const chat_socket = io.of('/all_chats').on("connection",(socket) => { });

app.use((req, res, next) => {

	req.chat_socket = chat_socket;

	next();
});

app.use('/users',userRouter);
app.use('/locations',locationRouter);
app.use('/chatrooms',chatroomRouter);
app.use('/chats',chatRouter);


mongoose.connect(config.MONGODB_PATH, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => server.listen(PORT,() => console.log(`Server listening on PORT: ${PORT}`)))
    .catch((err) => console.log(err));



mongoose.set('useFindAndModify', false);