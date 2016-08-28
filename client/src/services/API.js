const superagent = require('superagent')
const NotificationStore = require('../stores/NotificationStore')

const send = (method, args) => {
  const callback = (err, res) => {
    if (err) {
      NotificationStore.error({
        type: url.split('/')[1],
        value: err.response.body.error[0]
      })
      console.error(err)
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

;['get', 'post', 'put', 'delete'].forEach(method => {
  API[method] = function() {
    send(method, [...arguments])
  }
})

module.exports = API
