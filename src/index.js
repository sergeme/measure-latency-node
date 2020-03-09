require('dotenv').config()
//express server config
const {app, http} = require('./helpers/express')
//socket.io running on http instance
const io = require('socket.io')(http);
//application logic etc
const {connectToHost, dummyReply} = require('./helpers/helper');
const {hosts, hostnames} = require('./helpers/hosts');
const dummyHostArr = dummyReply(hostnames)

//Dummy route
app.get('/', async (req, res) => {
  res.send("foo");
});

//Root route, entry point
app.get('/view', async (req, res) =>{
  res.render('index', {req: req, data: dummyHostArr, currenthost: process.env.hostname, hosts: hosts, hostnames: hostnames});  
});

//route for connection testing - returns configured shorthand hostname
app.get('/measure', async (req, res) =>{
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(process.env.hostname));
});

//event listener for client/server connection
io.on('connection', function(socket){
  //server respons to latency event with timestamp submitted by client
  socket.on('latency', function (startTime, callback) {
    callback(startTime, process.env.hostname);
  }); 
  //server requests /measure on all hosts once this event gets triggered, sends data in callback
  socket.on('newconnection', async function (callback) {
    let hostArr = await connectToHost(hosts)
    callback(JSON.parse(hostArr));
  }); 
});

http.listen(process.env.port, function(){
  console.log(`listening on *:${(process.env.port)}`);
});