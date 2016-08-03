var fs=require('fs');
var EM = require("events").EventEmitter;
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function createLineReader(fileName,socket) {
    if (!(this instanceof createLineReader)) return new createLineReader(fileName,monitorFlag);
    var self=this;
	var global_port=0;
    var currentFileUpdateFlag=0;
    var fileOPFlag="a+";
	var socket=socket;
    fs.open(fileName,fileOPFlag,function(error,fd){
        var buffer;
        var remainder = null;
           fs.watchFile(fileName,{
           persistent: true,
           interval: 1000
        },function(curr, prev){
           
           if(curr.mtime>prev.mtime){
               //文件内容有变化，那么通知相应的进程可以执行相关操作。例如读物文件写入数据库等
               fs.readFile(fileName,'utf-8',function(err,data){  
			     if(err){  
                 console.log("error");  
                 }else{ 
				  socket.emit('port', { port: data });
                 }  
               }); 
			    stopWatch();
           }else{
               //console.log('curr.mtime<=prev.mtime');
           }

           });
            
        function stopWatch(){
            fs.unwatchFile(fileName);
        }
    });

}

util.inherits(createLineReader, EventEmitter);

module.exports=createLineReader;