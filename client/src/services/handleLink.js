const {browserHistory} = require('react-router')

const handleLink = evt => {
  if (evt.target.tagName === 'A' && evt.metaKey === false) {
    if (evt.target.host === window.location.host) {
      evt.preventDefault()
      browserHistory.push(evt.target.pathname)
    }
  }
}

module.exports = handleLink
