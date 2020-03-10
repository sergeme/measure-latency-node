/*
replace these entries with your own.
process.env.hostname (.env file) should be identical to the corresponding hosts.name entry
*/

const hosts = [
  {
    name: 'eu',
    fqdn: 'https://eu.test.sersch.me'
  },{
    name: 'usa',
    fqdn: 'https://usa.test.sersch.me'
  },{
    name: 'asia',
    fqdn: 'https://asia.test.sersch.me'
  },{
    name: 'aus',
    fqdn: 'https://aus.test.sersch.me'
  }
]

module.exports = {
  hosts
}
