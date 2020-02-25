var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var latency = require('./app');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  latency.request(Object.assign(url.parse('https://alchi.sersch.me'), {
  headers: {
    'User-Agent': 'Example'
  }
}), (err, res) => {
  console.log(err || res.timings)
})
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});