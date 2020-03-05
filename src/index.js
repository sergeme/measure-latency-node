const {app, http} = require('./helpers/express')
const io = require('socket.io')(http);
const helper = require('./helpers/helper');
const rp = require('request-promise-native')
require('dotenv').config()

/*
const hosts = [
 'https://eu.test.sersch.me',
 'https://usa.test.sersch.me',
 'https://asia.test.sersch.me',
 'https://aus.test.sersch.me',
 'https://test.sersch.me',
]

*/

//Make sure to also copy this to views/index.ejs
const hosts = [
  'http://wursttop:3000',
  'http://wursttop:3001'
]

const hostnames = [
  'localhost',
  'testhost'
]

//Root route, entry point
app.get('/', async (req, res) =>{
  let hostArr = []
  for(var x=0;x<hosts.length;x++) {
    await rp({
      uri: `${hosts[x]}/measure`,
      method: 'GET',
    }, 
    (err, resp) => {
      if(err==null) {
        var tempObj = JSON.parse(resp.body)
        hostArr.push(tempObj)
      }
    }).catch(function (err) {
      console.log(`${hosts[x]} no reply`)
  })
  }
  res.render('index', {req: req, data: hostArr, hosts: hosts, hostnames: hostnames});  
});
//Measurement route
app.get('/measure', async (req, res) =>{
  var reply = {host: process.env.hostname, entries: []}
  for(var x=0;x<hosts.length;x++) {
    await rp({
      uri: `${hosts[x]}/test`,
      method: 'GET',
      time: true,
      json: true
    }, 
    (err, resp) => {
      if(err==null) {
        var date = new Date(resp.timingStart)
        var timing = {total: helper.roundDown(resp.timingPhases.total)}
        var entry = {endpoint: resp.body,timings: timing}
        reply.entries.push(entry)
      }
        
        /*
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`,
        helper.roundDown(resp.timingPhases.wait),
        helper.roundDown(resp.timingPhases.dns),
        helper.roundDown(resp.timingPhases.tcp),
        helper.roundDown(resp.timingPhases.firstByte),
        helper.roundDown(resp.timingPhases.download),
        helper.roundDown(resp.timingPhases.total))*/
    }).catch(function (err) {
      console.log(`${hosts[x]} not running`)
  })
  }
  res.send(JSON.stringify(reply));
});
//route for connection testing
app.get('/test', async (req, res) =>{
  res.send(process.env.hostname);
});

io.on('connection', function(socket){
  
  socket.on('latency', function (startTime, callback) {
    callback(startTime, process.env.hostname);
  }); 
});

http.listen(process.env.port, function(){
  console.log(`listening on *:${(process.env.port)}`);
});