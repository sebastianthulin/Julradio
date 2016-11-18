'use strict'

const hub = require('clusterhub')

exports.showMostPlayed = (req, res, next) => {
  hub.get('mostPlayed', mostPlayed => {
    res.json(mostPlayed)
  })
}
