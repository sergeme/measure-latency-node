const roundDown = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}


module.exports = {
  roundDown
}