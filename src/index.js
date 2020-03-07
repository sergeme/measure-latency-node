const {app, http} = require('./helpers/express')
const io = require('socket.io')(http);
const {roundDown, foo} = require('./helpers/helper');
const {hosts, hostnames} = require('./helpers/hosts');
const rp = require('request-promise-native')
require('dotenv').config()

//Dummy route
app.get('/', async (req, res) => {
  res.send("foo");
});

//Root route, entry point
app.get('/view', async (req, res) =>{
  let hostArr = await foo(hosts)
  console.log(req);
  res.render('index', {req: req, data: hostArr, currenthost: process.env.hostname, hosts: hosts, hostnames: hostnames});  
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
          wait: roundDown(resp.timingPhases.wait), 
          dns: roundDown(resp.timingPhases.dns), 
          tcp: roundDown(resp.timingPhases.tcp), 
          firstByte: roundDown(resp.timingPhases.firstByte), 
          download: roundDown(resp.timingPhases.download), 
          total: roundDown(resp.timingPhases.total),
          socket: roundDown(resp.timings.socket),
          lookup: roundDown(resp.timings.lookup),
          connect: roundDown(resp.timings.connect),
          response: roundDown(resp.timings.response),
          end: roundDown(resp.timings.end)
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
    console.log("latency event emitted by client")
    callback(startTime, process.env.hostname);
  }); 

  socket.on('newconnection', async function (callback) {
    console.log("connection event emitted by client")
    let hostArr = await foo(hosts)
    callback(hostArr);
  }); 
});

http.listen(process.env.port, function(){
  console.log(`listening on *:${(process.env.port)}`);
});