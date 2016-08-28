const React = require('react')

const chronos = [{
  suffix: 'sekund',
  suffix2: 'sekunder',
  millis: 1000
}, {
  suffix: 'minut',
  suffix2: 'minuter',
  millis: 1000 * 60
}, {
  suffix: 'timme',
  suffix2: 'timmar',
  millis: 1000 * 60 * 60
}, {
  suffix: 'dag',
  suffix2: 'dagar',
  millis: 1000 * 60 * 60 * 24
}, {
  suffix: 'år',
  suffix2: 'år',
  millis: 1000 * 60 * 60 * 24 * 365
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
    this.date = Date.parse(this.props.date)
    this.tick()
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  tick() {
    const timeSince = Date.now() + window.__TIMEDIFFERENCE__ - this.date
    let i = chronos.length
    while (i--) {
      const chrono = chronos[i]
      const time = ~~(timeSince / chrono.millis)
      if (time >= 1) {
        const suffix = time === 1 ? chrono.suffix : chrono.suffix2
        return this.setState({time, suffix})
      }
    }
    this.setState({time: 1, suffix: chronos[0].suffix})
  }

  render() {
    let children = this.state.time + ' ' + this.state.suffix
    if (!this.props.short) {
      children += ' sedan'
    }

    return <span
      {...this.props}
      className="TimeSince"
      children={children}
    />
  }
}

module.exports = TimeSince
