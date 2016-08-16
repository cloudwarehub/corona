var restify = require('restify');
var cmd = require('node-cmd');
var os = require('os');
var fs = require('fs');
var uuid = require('uuid');

/* 参数获取 */
var token = process.argv[2];
var pool = process.argv[3];
var cluster_id = process.argv[4];

/* 创建host, 与pyxis建立连接 */
var socket = require('socket.io-client')('http://192.168.1.224:3001/host');

/* 收集系统信息 */
function get_host_info() {
  var getIps = function() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    return addresses;
  }

  var host_info = {
    platform: os.platform(),
    ostype: os.type(),
    arch: os.arch(),
    release: os.release(),
    uptime: os.uptime(),
    hostname: os.hostname(),
    cpus: os.cpus(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    loadavg: os.loadavg(),
    ips: getIps()
  };

  return host_info;
}

var host_info = get_host_info();
var hostid = uuid.v4();

/* 监测是否存在c:/.corona文件,该文件存在说明已经运行过corona, 该文件存有此host唯一id */
var lockfile = 'c:/.corona';
try {
  fs.accessSync(lockfile);
  hostid = fs.readFileSync(lockfile, 'utf8');
} catch (e) {
  fs.openSync(lockfile, 'w');
  fs.writeFileSync(lockfile, hostid);
}

host_info.id = hostid;
host_info.pool = pool;
host_info.token = token;
host_info.cluster_id = cluster_id;
socket.emit('host_info', host_info);


//服务端程序
var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

function step1(cmd) {
  return 'C:/cip-server.exe -cmd=' + cmd;
}

function str(username) {
  return
  'net user ' + username + 'p@ssw0rd /add' +
  'net localgroup "Remote Desktop Users" ' + username + ' /add' +
  'reg load HKU/' + username + ' C:/users/+' + username + '/NTUSER.DAT' +
  'cmdkey /generic:TERMSRV/localhost /user:' + username + ' /pass:p@ssw0rd' +
  'start /B mstsc /v:localhost';
}


cmd.get('C:\\Users\\beenquiver\\Desktop\\corona\\cmd.bat ' + 'cloud001', function(data) {
    console.log('the shell response is : ', data);
  }
);


