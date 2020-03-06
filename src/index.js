const {app, http} = require('./helpers/express')
const io = require('socket.io')(http);
const helper = require('./helpers/helper');
const {hosts, hostnames} = require('./helpers/hosts');
const rp = require('request-promise-native')
require('dotenv').config()

//Root route, entry point
app.get('/view', async (req, res) =>{
  let hostArr = []
  for(var x=0;x<hosts.length;x++) {
    await rp({
      uri: `${hosts[x]}/measure`,
      method: 'GET',
    }, 
    (err, resp) => {
      if(err==null) {
        try {
          var tempObj = JSON.parse(resp.body)
          hostArr.push(tempObj)
        }
        catch (e) {
        console.log(`${hosts[x]} node process not running`)
        }
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
        var timing = {
          wait: helper.roundDown(resp.timingPhases.wait), 
          dns: helper.roundDown(resp.timingPhases.dns), 
          tcp: helper.roundDown(resp.timingPhases.tcp), 
          firstByte: helper.roundDown(resp.timingPhases.firstByte), 
          download: helper.roundDown(resp.timingPhases.download), 
          total: helper.roundDown(resp.timingPhases.total),
          socket: helper.roundDown(resp.timings.socket),
          lookup: helper.roundDown(resp.timings.lookup),
          connect: helper.roundDown(resp.timings.connect),
          response: helper.roundDown(resp.timings.response),
          end: helper.roundDown(resp.timings.end)
        }

        var entry = {endpoint: resp.body,timings: timing}
        reply.entries.push(entry)
      }
        /*
        ))*/
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
    console.log("io event emitted by client")
    callback(startTime, process.env.hostname);
  }); 
});

http.listen(process.env.port, function(){
  console.log(`listening on *:${(process.env.port)}`);
});