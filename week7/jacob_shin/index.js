const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({ // template (definition)
  content: { type: String } 
})

const MessageModel = mongoose.model("Message", messageSchema); // class and document is the instance 



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });


io.on('connection', async function(socket){
console.log('a user connected');
  //challenge log all the message in the history. 
  const history = await MessageModel.find();
  console.log(history);
  index = 1;
  history.forEach(message => {
    console.log(message.content);
    console.log(index);
    index += 1;
    io.emit('chat message', message.content);
});


  console.log(history);
  
// socket.broadcast.emit('chat message', 'Someone entered the chat!');
socket.on('delete', async function(){
  await MessageModel.deleteMany({});
  console.log("deleted all");
  const history = await MessageModel.find();
  console.log(history);

});

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
    const message = new MessageModel();
    const nickname = socket.nickname || 'Anonymous';
    msg = `${nickname}: ${msg}`;
    message.content = msg;
    message.save().then(m => {
      io.emit('chat message', msg)
    });

    
    
    // io.emit('chat message', `${nickname}: ${msg}`);
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


server.listen(3000, async function() {
  await mongoose.connect("mongodb+srv://jacobshin:Shin0204!@cluster0.pzvyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log('listening on *:3000');


});

