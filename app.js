'use strict';

const cluster = require('cluster')
const childProcess = require('child_process')
const os = require('os')
const forks = {}

function fork(service) {
  console.log(`Forking ${service}`)
  const child = childProcess.fork(`server/workers/${service}`)
  forks[service] = child

  child.on('message', function(data) {
    for (let id in cluster.workers) {
      cluster.workers[id].send({ data, service })
    }
  })

  child.on('exit', function() {
    console.log(`${service} exited`)
    setTimeout(() => fork(service), 1000)
  })
}

if (cluster.isMaster) {
  const numWorkers = process.env.NODE_ENV === 'production'
    ? os.cpus().length
    : 1

  console.log(`Master cluster setting up ${numWorkers} workers...`)

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }

  cluster.on('message', function(data) {
    forks[data.service].send(data.data)
  })

  cluster.on('online', function(worker) {
    console.log(`Worker ${worker.process.pid} is online`)
  })

  cluster.on('exit', function(worker, code, signal) {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
    console.log('Starting a new worker')
    cluster.fork()
  })

  ;(['RadioStream', 'TweetStream', 'Reservations', 'Requests']).forEach(fork)
}

if (cluster.isWorker) {
  require('./server')
}