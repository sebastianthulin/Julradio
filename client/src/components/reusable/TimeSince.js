const React = require('react')

const chronos = [{
  suffix: 'sekund sedan',
  suffix2: 'sekunder sedan',
  millis: 1000
}, {
  suffix: 'minut sedan',
  suffix2: 'minuter sedan',
  millis: 1000 * 60
}, {
  suffix: 'timme sedan',
  suffix2: 'timmar sedan',
  millis: 1000 * 60 * 60
}, {
  suffix: 'dag sedan',
  suffix2: 'dagar sedan',
  millis: 1000 * 60 * 60 * 24
}]

class TimeSince extends React.Component {
  componentWillMount() {
    this.state = {}
    this.setTicker()
  }

  componentWillReceiveProps() {
    this.setTicker()
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  setTicker() {
    clearInterval(this.interval)
    this.date = new Date(this.props.date).getTime()
    this.tick()
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  tick() {
    var timeSince = Date.now() + window.__TIMEDIFFERENCE__ - this.date
    var i = chronos.length
    while (i--) {
      var chrono = chronos[i]
      var result = ~~(timeSince / chrono.millis)
      if (result >= 1) {
        return this.setState({
          time: result + ' ' + (result === 1 ? chrono.suffix : chrono.suffix2)
        })
      }
    }
  }

  render() {
    return <span {...this.props}>{this.state.time}</span>
  }
}

module.exports = TimeSince