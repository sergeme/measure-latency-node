var socket = io.connect('http://localhost');
var startTime;

setInterval(function() {
  startTime = Date.now();
  socket.emit('ping');
}, 2000);

socket.on('pong', function() {
  latency = Date.now() - startTime;
  console.log(latency);
});