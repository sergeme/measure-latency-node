var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var latency = require('./app');
var url = require('url');
var hosts = [
  'https://www.sersch.me',
  'https://www.sersch.me',
  'https://www.sersch.me',
  'https://www.sersch.me',
  'https://www.sersch.me'
]

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  hosts.forEach(host => {
    latency.request(Object.assign(url.parse(host), {
    headers: {
      'User-Agent': 'Example'
    }
    }), (err, res) => {
      console.log(err || res.timings)
    })
  });
  
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});