const { EventEmitter } = require('events')
const request = require('../services/request')
const ReservationStore = new EventEmitter

var reservations

ReservationStore.get = function() {

}

module.exports = ReservationStore