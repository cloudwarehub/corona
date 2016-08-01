var restify = require('restify');
var assert  = require('assert');
var client = restify.createJsonClient({
  url: 'http://localhost:8080'
});


client.post('/run', { cmd: 'guodong',username:'guodong' }, function(err, req, res, obj) {
  if(err)console.log(err);
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});

