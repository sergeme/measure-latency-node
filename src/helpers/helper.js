const rp = require('request-promise-native')
const roundDown = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

const foo = async (hosts) => {
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
  return hostArr;
}


module.exports = {
  roundDown, foo
}