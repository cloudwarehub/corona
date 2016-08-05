var restify = require('restify');
var cmd=require('node-cmd');
var os=require('os');

//服务端程序
var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

function step1(cmd){

 return 'C:/cip-server.exe -cmd='+cmd;

}

function  str(username){
 return
	'net user '+username+'p@ssw0rd /add'+
	'net localgroup "Remote Desktop Users" '+username+' /add'+
	'reg load HKU/'+username+' C:/users/+'+username+'/NTUSER.DAT'+
	'cmdkey /generic:TERMSRV/localhost /user:'+username+' /pass:p@ssw0rd'+
	'start /B mstsc /v:localhost';
}


 cmd.get(
		 'C:\\Users\\beenquiver\\Desktop\\corona\\cmd.bat ' + 'cloud001',
        function(data){
            console.log('the shell response is : ',data);
			
        }
    );


