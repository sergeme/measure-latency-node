//got.js http request module
const got = require('got')

//replaces "0" with "<1"
const roundDown = (num) => {
  if(num == 0) {
    return "<1";
  }
  else {
    return num;
  }
}

const connectToHost = async (hosts) => {
  var reply = {host: process.env.hostname, entries: []}
  const now = Date.now()
  for(var x=0;x<hosts.length;x++) {
    try {
    const resp = await got('test',{prefixUrl: `${hosts[x]}`, timings: true, JSON: true});
    var timing = {
      wait: roundDown(resp.timings.phases.wait), 
      dns: roundDown(resp.timings.phases.dns), 
      tcp: roundDown(resp.timings.phases.tcp), 
      tls: roundDown(resp.timings.phases.tls),
      request: roundDown(resp.timings.phases),
      firstByte: roundDown(resp.timings.phases.firstByte), 
      download: roundDown(resp.timings.phases.download), 
      total: roundDown(resp.timings.phases.total)
    }
    var entry = {endpoint: JSON.parse(resp.body),timings: timing}
    reply.entries.push(entry)
      
    } catch (error) {
      console.log(`${hosts[x]} not running`)
    }
  }
  console.log(Date.now()-now)
  return JSON.stringify(reply);
}

//creates a dummy object, required for building ejs template
const dummyReply = function (hosts) {
  let hostArr = []
  for(var x=0;x<hosts.length;x++) {
    var reply = {host: hosts[x], entries: []}
    for(var y=0;y<hosts.length;y++) {
      var entry = {endpoint: hosts[y]}
      reply.entries.push(entry)
    }
    hostArr.push(reply);
  }
  return hostArr;
}


module.exports = {
  roundDown, connectToHost, dummyReply
}