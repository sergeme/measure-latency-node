const {app, http} = require('./helpers/express')
const {asyncForEach} = require('./helpers/asyncForEach')
const io = require('socket.io')(http);
const url = require('url');
const testData = require('./test');
const helper = require('./helpers/helper');
const rp = require('request-promise-native')
const port = 3002;

const Data = function (host,entries) {
  this.host=host,
  this.entries=entries
  /*this.start=start,
  this.wait=wait,
  this.dns=dns,
  this.tcp=tcp,
  this.firstByte=firstByte,
  this.download=download,
  this.total=total*/
}

const host = `http://localhost:${port}`
const hosts = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003'
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
      hostArr.push(tempObj)
    })
  }
  console.log(hostArr)
  res.render('index', {req: req, data: hostArr});  
});

app.get('/measure', async (req, res) =>{
  var reply = {host: host, entries: []}
  for(var x=0;x<hosts.length;x++) {
    await rp({
      uri: `${hosts[x]}/test`,
      method: 'GET',
      time: true,
      json: true
    }, 
    (err, resp) => {
      var date = new Date(resp.timingStart)
      var timing = {total: helper.roundDown(resp.timingPhases.total)}
      var entry = {endpoint: hosts[x],timings: timing}
      reply.entries.push(entry)
        
        /*
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`,
        helper.roundDown(resp.timingPhases.wait),
        helper.roundDown(resp.timingPhases.dns),
        helper.roundDown(resp.timingPhases.tcp),
        helper.roundDown(resp.timingPhases.firstByte),
        helper.roundDown(resp.timingPhases.download),
        helper.roundDown(resp.timingPhases.total))*/
    })
  }
  res.send(JSON.stringify(reply));
});

app.get('/test', async (req, res) =>{
  res.send("pong");
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('latency', function (startTime, callback) {
    callback(startTime);
  }); 
});

http.listen(port, function(){
  console.log(`listening on *:${port}`);
});