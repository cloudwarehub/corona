 var socket = require('socket.io-client')('http://localhost:81');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
  socket.send(3389);
  socket.on('message', function (msg) {
      // my msg
    });