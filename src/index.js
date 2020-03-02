const {app, http} = require('./helpers/express')
const {asyncForEach} = require('./helpers/asyncForEach')
const io = require('socket.io')(http);
const url = require('url');
const latency = require('./helpers/measure');
const rp = require('request-promise-native')

const hosts = [
  'https://www.sersch.me',
  'https://www.github.com',
  'https://www.google.ch',
  'http://localhost:3000/test'
]

app.get('/', async (req, res) =>{
  const hostArr = []
  await rp({
    uri: 'https://google.com',
    method: 'GET',
    time: true
  }, 
  (err, resp) => {
    console.log(err || resp.timings)
    hostArr.push(resp.timings)
    hostArr.push(resp.timings)
  })
  res.render('index', {req: req, arr: hostArr});  
});

app.get('/test', function(req, res){
  res.send("foo");  
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('latency', function (startTime, cb) {
    cb(startTime);
  }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});