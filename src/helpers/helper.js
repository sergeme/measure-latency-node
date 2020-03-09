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
  const promises = hosts.map(async function (host, index, array) {
    try {
      const resp = await got('measure',{prefixUrl: `${host}`, timings: true, JSON: true})
      return {
        endpoint: JSON.parse(resp.body),
        timings: {
          wait: roundDown(resp.timings.phases.wait), 
          dns: roundDown(resp.timings.phases.dns), 
          tcp: roundDown(resp.timings.phases.tcp), 
          tls: roundDown(resp.timings.phases.tls),
          request: roundDown(resp.timings.phases),
          firstByte: roundDown(resp.timings.phases.firstByte), 
          download: roundDown(resp.timings.phases.download), 
          total: roundDown(resp.timings.phases.total)
        }
      }
    } 
    catch (error) {
        console.log(`${host} not running`)
    }  
  })
  const results = await Promise.all(promises)
  reply.entries = results;
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