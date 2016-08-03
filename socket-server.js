var io = require('socket.io').listen(81);

io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
  
    console.log('received data is the '+data);
  });
  socket.on('disconnect', function () { });
  socket.emit('run','cmd.exe');
  socket.on('my other event', function (data) {
    console.log(data);
  });
});