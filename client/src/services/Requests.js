const API = require('./API')

module.exports = {
  create: (opts, cb) => API.post('/request', opts, cb),
  fetch: cb => API.get('/request', cb),
  accept: (id, cb) => API.put('/request/' + id, cb),
  deny: (id, cb) => API.delete('/request/' + id, cb),
  wipe: cb => API.delete('/request/all', cb)
}
