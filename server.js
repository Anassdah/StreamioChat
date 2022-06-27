const express = require('express');
const cors = require('cors');
const mongoose=require('mongoose');
const Msg= require('./models/messages');
const mongoDB="mongodb+srv://anassdah:Anass-2000@cluster0.azqx3.mongodb.net/chat?retryWrites=true&w=majority";
mongoose.connect(mongoDB).then(()=>{
    console.log('connected to mongoDB')
}).catch(err=>console.log(err))
const app = express();
app.use(cors());
app.use(express.json());
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    },
});


app.get('/', (req, res) => {
    res.send('Hello world');
})

let userList = new Map();


io.on('connection', (socket) => {
    let userName = socket.handshake.query.userName;
    Msg.find().then((result) =>{
        socket.emit('output-messages',result)
    })
    //socket.id=socket.handshake.query.room;
    addUser(userName, socket.id);
    socket.nickname=userName;
    console.log(socket.nickname);
    let query = socket.handshake.query;
    console.log(query);
    socket.broadcast.emit('user-list', [...userList.keys()]);
    socket.emit('user-list', [...userList.keys()]);
    socket.on('join-room',(room)=> {
        console.log(room);
        socket.join(room)});
        /*const clients = io.sockets.adapter.rooms.get(room);
        console.log(clients);
        for (const clientId of clients ) {

            //this is the socket of each client in the room.
            const clientSocket = io.sockets.sockets.get(clientId);
            userList.set(clientSocket.nickname, new Set(clientSocket.id));
            console.log(clientSocket.nickname);
            //id=clientSocket.id;
            
        }})
*/
    socket.on('message', (msg,room) => {
        //socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
        const message= new Msg({msg:msg,room:room,username:userName});
        message.save().then(() =>{
            socket.to(room).emit('message-broadcast', {message: msg, userName: userName})
        })
        
    })

    socket.on('disconnect', (reason) => {
        removeUser(userName, socket.id);
    })
});


function addUser(userName, id) {
    if (!userList.has(userName)) {
        userList.set(userName, new Set(id));
    } else {
        userList.get(userName).add(id);
    }
}

function removeUser(userName, id) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size == 0) {
            userList.delete(userName);
        }
    }
}


http.listen(4004,()=>{console.log('Server is running');
});