const {createStore, compose, applyMiddleware} = require('redux')
const thunkMiddleware = require('redux-thunk').default
const reducer = require('./reducers')

const configureStore = () => {
  const middlewares = [thunkMiddleware]

  return createStore(
    reducer,
    compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}

module.exports = configureStore
