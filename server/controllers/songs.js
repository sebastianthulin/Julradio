'use strict'

const {Song} = require('../models')

let mostPlayed = []

const generateMostPlayed = async () => {
  const playCountMap = {}
  const songs = await Song.find().select('title').lean()
  for (let song of songs) {
    playCountMap[song.title] = (playCountMap[song.title] || 0) + 1
  }
  mostPlayed = Object.keys(playCountMap)
    .sort((a, b) => playCountMap[b] - playCountMap[a])
    .slice(0, 50)
    .map(title => ({title, playCount: playCountMap[title]}))
}

exports.showMostPlayed = (req, res, next) => {
  res.json(mostPlayed)
}

generateMostPlayed()
setInterval(generateMostPlayed, 600000)
