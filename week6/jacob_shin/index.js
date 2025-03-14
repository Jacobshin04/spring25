const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });


io.on('connection', (socket) => {
console.log('a user connected');

// socket.broadcast.emit('chat message', 'Someone entered the chat!');
 

socket.on('disconnect', () => {
    console.log('user disconnected');
    nickname = socket.nickname;
    if (nickname == undefined | nickname == null){
      socket.nickname = 'Anonymous';
      console.log('changed to nickname: ' + socket.nickname);

    }
    socket.broadcast.emit('chat message', `${socket.nickname} left the chat...`);

});

//receive on node side
socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

socket.on('chat message', (msg) => {
    const nickname = socket.nickname || 'Anonymous';
    io.emit('chat message', `${nickname}: ${msg}`);
});

socket.on('nickname', (nickname) => {
    // io.emit('chat message', msg);
    // });
    console.log('nickname: ' + nickname);

    socket.nickname = nickname
    // console.log(typeof(nickname))
    if (nickname == undefined | nickname == null){
      socket.nickname = 'Anonymous';
      console.log('changed to nickname: ' + socket.nickname);
    }
    socket.broadcast.emit('chat message', `${socket.nickname} entered the chat!`);

});

socket.on('typing', () => {
  const nickname = socket.nickname || 'Anonymous';
  socket.broadcast.emit('typing', `${nickname} is typing...`);
});

socket.on('not typing', () => {
  const nickname = socket.nickname || 'Anonymous';
  socket.broadcast.emit('not typing', `${nickname} stopped typing...`);
});
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});