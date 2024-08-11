const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = 9090;
const io = new Server(server); //WebSocket Connection

//middleware
app.use(express.static(path.join(__dirname, 'public')));


//Connection
io.on('connection', (socket) => {
    
    socket.on('user', (user) => {
        console.log(`${user} is Connected with Id:`, socket.id);
    })

    //To Broadcast message from client
    socket.on('chat', (obj) => {
        console.log(`${obj.user} (${socket.id}): ${obj.msg}`);
        socket.broadcast.emit('chat', obj);
    })

    // socket.on('disconnect', () => {
    //     console.log(`${socket.id} is disconnected!!`);
    // })
});



server.listen(PORT, (err)=>{
    if(err) throw err;
    else console.log(`Server is running on PORT : ${PORT}`);
})



