require('./services/liveReload')
const React = require('react')
const ReactDOM = require('react-dom')
const {Router, browserHistory} = require('react-router')
const {Provider} = require('react-redux')
const marked = require('marked')
const configureStore = require('./configureStore')
const routes = require('./routes')
const runLogic = require('./logic')

const store = configureStore()
runLogic(store)

marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: true
})

ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('root')
)
