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
	'start /B mstsc /v:localhost'
}

server.post('/run', respond);
function respond(req, res, next) {
    //res.send('hello ' + req.params.cmd);
	
	 cmd.get(
        step1(req.params.cmd),
        function(data){
            console.log('the shell response is : ',data);
			res.send(data);
        }
    );
	
    cmd.get(
        str(req.params.username),
        function(data){
            console.log('the shell response is : ',data);
			res.send(data);
        }
    );
	
    next();
}

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});



//客户端心跳包

var client = restify.createJsonClient({
  url: 'http://localhost:8080'
});


function  heartblead(){
client.post('/route', {arch:os.arch(), cpus:os.cpus(),endianness:os.endianness(),
freemem:os.freemem(),homedir:os.homedir(),hostname:os.hostname(),loadavg:os.loadavg(),
networkInterfaces:os.networkInterfaces(),platform:os.platform(),release:os.release(),
tmpdir:os.tmpdir(), totalmem:os.totalmem(),type:os.type(),uptime:os.uptime()

}, function(err, req, res, obj) {
  if(err)console.log(err);
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});
}

setInterval(heartblead,5000);
