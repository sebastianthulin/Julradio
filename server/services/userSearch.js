'use strict'

const {User} = require('../models')

const SAFE_SELECT = '-hash -email -activated'
let users = []

const fetchUsers = () => {
  User.find().select(SAFE_SELECT).lean().then(docs => {
    users = docs
  })
}


const userSearch = _query => {
  const query = String(_query).toLowerCase().trim()
  if (!query) {
    return []
  }
  return users
    .filter(user => user.usernameLower.indexOf(query) > -1)
    .sort((a, b) => b.lastVisit - a.lastVisit)
    .slice(0, 20)
}

fetchUsers()
setInterval(fetchUsers, 600000)

module.exports = userSearch
