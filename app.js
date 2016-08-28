'use strict';

const cluster = require('cluster')
const childProcess = require('child_process')
const os = require('os')
const config = require('./config')
const workers = []
const subscriptions = {}

function handleWorker(worker) {
  workers.push(worker)

  worker.on('message', function(data) {
    if (data.subscribe) {
      subscriptions[data.subscribe] = subscriptions[data.subscribe] || []
      subscriptions[data.subscribe].push(worker)
    }
    if (data.event) {
      const workers = subscriptions[data.event]
      if (workers) {
        workers.forEach(worker => worker.send(data))
      }
    }
  })

  worker.on('exit', function() {
    workers.splice(workers.indexOf(worker), 1)
    for (let event in subscriptions) {
      let i = subscriptions[event].length
      while (i--) {
        if (subscriptions[event][i] === worker) {
          subscriptions[event].splice(i, 1)
        }
      }
    }
  })
}

function fork(service) {
  console.log(`Forking ${service}`)
  const worker = childProcess.fork(`server/workers/${service}`)
  handleWorker(worker)

  worker.on('exit', function() {
    console.log(`${service} exited`)
    setTimeout(() => fork(service), 10000)
  })
}

if (cluster.isMaster) {
  const numWorkers = config.multiCore ? os.cpus().length : 1
  console.log(`Master cluster setting up ${numWorkers} workers...`)

  for (let i = 0; i < numWorkers; i++) {
    handleWorker(cluster.fork())
  }

  cluster.on('online', function(worker) {
    console.log(`Worker ${worker.process.pid} is online`)
  })

  cluster.on('exit', function(worker, code, signal) {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
    console.log('Starting a new worker')
    handleWorker(cluster.fork())
  })

  ;[
    'TweetStream',
    'Reservations',
    'Requests',
    // 'OnlineList'
  ].forEach(fork)

  if (config.shoutCastOnline) {
    fork('RadioStream')
  }
}

if (cluster.isWorker) {
  require('./server')
}
