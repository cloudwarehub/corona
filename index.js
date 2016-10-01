var cmd = require('node-cmd');
var os = require('os');
var fs = require('fs');
var uuid = require('uuid');
var shortid = require('shortid');

var restify = require('restify');


var sessions = [];

function respond(req, res, next) {
  for (var i in sessions) {
    if (sessions[i].id == req.params.sessid) {
      res.send(sessions[i].cmd);
      break;
    }
  }
  next();
}

var server = restify.createServer();
server.get('/session/:sessid', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function run(sess) {
  cmd.get('c:/corona/cmd.bat ' + sess.id);
}

/* 参数获取 */
var token = process.argv[2];
var pool = process.argv[3];
var cluster_id = process.argv[4];
var pyxis_addr = process.argv[5];
console.log(pyxis_addr);
/* 与pyxis建立连接 */
var socket = require('socket.io-client')('ws://' + pyxis_addr + '/host');
socket.on('connect', sendHostInfo);

function sendHostInfo() {
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
}


function check(session) {
  var portfile = 'c:/users/' + session.id + '/pulsar-port.txt';
  try {
    fs.accessSync(portfile);
    session.port = fs.readFileSync(portfile, 'utf8');
    socket.emit('runsuccess', {port: session.port, session: session.id, token: session.token});
    if (session.port)
      clearTimeout(session.checkTimeout);
  } catch (e) {
    // continue wait
    session.checkTimeout = setTimeout(function(){check(session)}, 400);
  }
}
function getPulsarPort(session) {
  session.checkTimeout = setTimeout(function(){check(session)}, 400);
}

socket.on('run', function(msg) {
  console.log('run', msg);

  /* create session */
  var sess = {
    id: shortid.generate(),
    cmd: msg.cmd,
    token: msg.token
  };
  sessions.push(sess);

  /* get pulsar port */
  getPulsarPort(sess);

  /* run cloudware */
  run(sess);

});
