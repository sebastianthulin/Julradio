const { createStore, combineReducers, applyMiddleware } = require('redux')
const thunkMiddleware = require('redux-thunk')
const reducers = require('./reducers')

const store = applyMiddleware(thunkMiddleware)(createStore)(combineReducers(reducers))

module.exports = store