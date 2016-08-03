var createLineReader=require('./new');
var uuid = require('node-uuid');
var fs=require('fs');
var cmd=require('node-cmd');
var namespace='C:/Users/';
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
			//写命令参数
			fs.writeFile(namespace+username, data, function (err) {
			if (err) throw err;
			});
			//再读取端口号即可
			var reader=new createLineReader(namespace+username+'/1.txt',socket);
        }
     );
	 //先写再读
	 
    socket.emit('finished', { finished: true});
  });