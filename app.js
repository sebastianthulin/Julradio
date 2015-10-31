'use strict';

const cluster = require('cluster')
const childProcess = require('child_process')
const os = require('os')

function fork(service) {
  console.log(`Forking ${service}`)
  const child = childProcess.fork(`server/${service}`)

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
    : 2

  console.log(`Master cluster setting up ${numWorkers} workers...`)

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }

  cluster.on('online', function(worker) {
    console.log(`Worker ${worker.process.pid} is online`)
  })

  cluster.on('exit', function(worker, code, signal) {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
    console.log('Starting a new worker')
    cluster.fork()
  })

  fork('RadioStream')
  fork('TweetStream')
} else {
  require('./server')
}