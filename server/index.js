'use strict'

const cluster = require('cluster')
const childProcess = require('child_process')
const os = require('os')
const config = require('../config')
const workers = []
const subscriptions = {}
const hub = require('clusterhub')

const workerNames = [
  'radioStream',
  'reservations',
  'tweetStream',
  'songRequests',
  // 'OnlineList'
]

if (cluster.isMaster) {
  const numWorkers = config.multiCore ? os.cpus().length : 1
  console.log(`Master cluster setting up ${numWorkers} workers...`)

  const workerOpts = [
    ...Array(numWorkers).fill(),
    ...workerNames.map(workerName => ({workerName}))
  ]
  const workers = workerOpts.map(opts => cluster.fork(opts))

  cluster.on('online', function(worker) {
    console.log(`Worker ${worker.process.pid} is online`)
  })

  cluster.on('exit', function(worker, code, signal) {
    const workerIndex = workers.indexOf(worker)
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
    if (workerIndex > -1) {
      console.log('Starting a new worker')
      workers[workerIndex] = cluster.fork(workerOpts[workerIndex])
    }
  })
} else {
  const {workerName} = process.env
  if (workerNames.indexOf(workerName) > -1) {
    require((`./workers/${workerName}`))
  } else {
    require('./main')
  }
}
