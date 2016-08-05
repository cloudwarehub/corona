var createLineReader=require('./new');
var uuid = require('node-uuid');
var fs=require('fs');
var cmd=require('node-cmd');
var namespace='C:/Users/';
var net = require('net');


//监听端口号named pipe
var server = net.createServer(function(stream) {
  stream.on('data', function(c) {
    console.log('portal:', c.toString());
  });
  stream.on('end', function() {
    server.close();
  });
});
//监听端口号
server.listen(namespace+'/tmp/port.sock');




var socket = require('socket.io-client')('http://localhost:81');


function  str(username){
 return
	'C:\\Users\\beenquiver\\Desktop\\corona\\cmd.bat ' + username;
}

 socket.on('run', function (data) {//写内容到文件里面即可
	 var username=uuid.v1();
	 cmd.get(
        'C:\\Users\\beenquiver\\Desktop\\corona\\cmd.bat ' + username,
        function(ans){
            console.log('the new user is : ',username);
			console.log('the cmd ans id ',ans);
			//登录进入之后应该写哪些内容呢?监听管道,写管道
			//写命令参数,pipe
			var stream = net.connect(namespace+'/tmp/cmd.sock');
			stream.write(data);
			stream.end();

			//再读取端口号即可
			//var reader=new createLineReader(namespace+username+'/1.txt',socket);
        }
     );
	 //先写再读
	 
    socket.emit('finished', { finished: true});
  });