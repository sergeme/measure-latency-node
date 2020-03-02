const {app, http} = require('./helpers/express')
const {asyncForEach} = require('./helpers/asyncForEach')
const io = require('socket.io')(http);
const url = require('url');
const helper = require('./helpers/helper');
const rp = require('request-promise-native')
const Data = function (host,endpoint,lookup,socket,connect,response,end) {
  this.host=host,
  this.endpoint=endpoint,
  this.lookup=lookup,
  this.socket=socket,
  this.connect=connect,
  this.response=response,
  this.end=end
}
const host = "localhost"
const hosts = [
  'http://127.0.0.1:3000',
  'http://localhost:3000'
]
//Entrypoint
app.get('/', async (req, res) =>{
  let hostArr = []
  for(var x=0;x<hosts.length;x++) {
    await rp({
      uri: `${hosts[x]}/measure`,
      method: 'GET',
    }, 
    (err, resp) => {
      var tempObj = JSON.parse(resp.body)
      tempObj.forEach(function (obj) {
        hostArr.push(obj)
      })
    })
  }
  console.log(hostArr.length)
  res.render('index', {req: req, arr: hostArr});  
});

app.get('/measure', async (req, res) =>{
  const hostArr = []
  for(var x=0;x<hosts.length;x++) {
    await rp({
      uri: `${hosts[x]}/test`,
      method: 'GET',
      time: true,
      json: true
    }, 
    (err, resp) => {
      var reply = new Data(host,hosts[x],
        helper.roundDown(resp.timings.lookup),
        helper.roundDown(resp.timings.socket),
        helper.roundDown(resp.timings.connect),
        helper.roundDown(resp.timings.response),
        helper.roundDown(resp.timings.end))
      hostArr.push(reply)
    })
  }
  res.send(JSON.stringify(hostArr));
});

app.get('/test', async (req, res) =>{
  res.send("pong");
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