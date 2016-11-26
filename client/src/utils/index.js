const {browserHistory} = require('react-router')

export const createArray = (length, cb) => {
  const arr = Array(length)
  for (let i = 0; i < length; i++) {
    arr[i] = cb(i)
  }
  return arr
}

export const handleLink = evt => {
  if (evt.target.tagName === 'A' && evt.metaKey === false) {
    if (evt.target.host === window.location.host) {
      evt.preventDefault()
      browserHistory.push(evt.target.pathname)
    }
  }
}

export const userRole = user => {
  const roles = ((user || {}).roles || {})
  const is = role => !!roles[role]
  const isWriter = () => is('writer')
  const isRadioHost = () => is('radioHost')
  const isAdmin = () => is('admin')
  const isPrivileged = () => isWriter() || isRadioHost() || isAdmin()
  return {isWriter, isRadioHost, isAdmin, isPrivileged}
}
