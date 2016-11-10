'use strict'

require('clusterhub')
const cluster = require('cluster')
const os = require('os')
const config = require('../config')

const workerNames = [
  'radioStream',
  'reservations',
  'tweetStream',
  'songRequests',
  'onlineList'
]

if (cluster.isMaster) {
  const numWorkers = config.multiCore ? os.cpus().length : 1
  console.log(`Master cluster setting up ${numWorkers} workers...`)

  const optsMap = new WeakMap

  const start = opts => {
    const worker = cluster.fork(opts)
    optsMap.set(worker, opts)
  }

  cluster.on('online', worker => {
    console.log(`Worker ${worker.process.pid} is online`, optsMap.get(worker))
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`, optsMap.get(worker))
    start(optsMap.get(worker))
  })

  ;[
    ...Array(numWorkers).fill(),
    ...workerNames.map(workerName => ({workerName}))
  ].forEach(start)
} else {
  const {workerName} = process.env
  if (workerNames.indexOf(workerName) > -1) {
    require((`./workers/${workerName}`))
  } else {
    require('./main')
  }
}
