require('./services/LiveReload')
require('./logic')
const React = require('react')
const ReactDOM = require('react-dom')
const { Router } = require('react-router')
const { Provider } = require('react-redux')
const marked = require('marked')
const store = require('./store')
const routes = require('./routes')
const history = require('./services/history')

// Config
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: true
})

ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>,
  document.getElementById('root')
)