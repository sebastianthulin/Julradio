const React = require('react')
const ReactDOM = require('react-dom')
const {Provider} = require('react-redux')
const {Router, browserHistory, applyRouterMiddleware} = require('react-router')
const {useScroll} = require('react-router-scroll')
const marked = require('marked')
const routes = require('./routes')
const configureStore = require('./configureStore')
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
    <Router
      routes={routes}
      history={browserHistory}
      render={applyRouterMiddleware(useScroll())}
    />
  </Provider>,
  document.getElementById('root')
)
