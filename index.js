const express = require('express');
const http = require('http');
const path = require('path');
const multer = require('multer');
const { writeFile } = require('fs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = 9090;
const io = new Server(server); //WebSocket Connection

//middleware
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/uploads');
    },
    filename : (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
})

const upload = multer({storage: storage})


//Connection
io.on('connection', (socket) => {

    socket.on('user', (user) => {
        console.log(`${user} is Connected with Id:`, socket.id);
    })

    socket.on('connected_user', (user) => { 
        socket.broadcast.emit('connected_user', user);
    })

    //To Broadcast message from client
    socket.on('chat', (obj) => {
        console.log(`${obj.user} (${socket.id}): ${obj.msg}`);
        socket.broadcast.emit('chat', obj);
    })
    
    socket.on('upload_media', (file, callback) => {
        console.log(file);

        writeFile(path.resolve(__dirname,`uploads/Data-${date_cal(new Date.now())}.jpeg`), Buffer.from(file,'base64'), (err) => {
            console.log(err);
            callback({message : err ? "faliure" : "success"})
        })
    })
    socket.on('disconnect', () => {
        socket.on('disconnect_user', (User) => {
            socket.emit('disconnect_user', User);
            console.log(`${socket.id} is disconnected!!`);
        })
    })    
});


function date_cal(date){
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}



server.listen(PORT, (err)=>{
    if(err) throw err;
    else console.log(`Server is running on PORT : ${PORT}`);
})



