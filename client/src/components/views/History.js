var React = require('react')
var RadioStore = require('../../stores/RadioStore')

class History extends React.Component {
  componentWillMount() {
    this.unsubscribe = RadioStore.subscribe.history(this.handleHistory.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleHistory(history) {
    this.setState({history})
  }

  renderSongs(title) {
    return this.state.history.slice().reverse().map(title => (
      <div>
        {title}
      </div>
    ))
  }

  render() {
    return (
      <div id="history" className="row content">
        <h1>30 senaste spelade</h1>
        {this.renderSongs()}
      </div>
    )
  }
}

module.exports = History