const superagent = require('superagent')
const NotificationStore = require('../stores/NotificationStore')

const send = function(method, args) {
  const callback = function(err, res) {
    if (err) {
      NotificationStore.error({
        type: url.split('/')[1],
        value: err.response.body.error[0]
      })
    } else {
      cb(res.body)
    }
  }
  const url = args[0]
  const cb = args.pop()
  args[0] = '/api' + url
  method = method === 'delete' ? 'del' : method
  superagent[method].apply(superagent, args).end(callback)
}

const API = {}

;['get', 'post', 'put', 'delete'].forEach(function(method) {
  API[method] = function() {
    send(method, [...arguments])
  }
})

module.exports = API