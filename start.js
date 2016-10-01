var http = require('http');
var path = require('path');
var cmd = require('node-cmd');

var options = {
  host: 'localhost',
  port: 8080,
  path: '/session/' + process.env['USERPROFILE'].split(path.sep)[2]
};
var t = setTimeout(function() {
  http.get(options, (res) => {
    console.log(`Got response: ${res.statusCode}`);
    res.on('data', function (chunk) {
      cmd.get('c:/pulsar-windows/pulsar-windows.exe ' + chunk);
    });

    res.resume();
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
  clearTimeout(t);
}, 4000);

