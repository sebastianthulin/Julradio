var React = require('react')
var { Link } = require('react-router')
var RadioStore = require('../../../stores/RadioStore')
var Controls = require('./Controls')

class OnAir extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('metadata', this.handleMetadata.bind(this))
    RadioStore.subscribe.history(this.handleHistory.bind(this))
  }

  handleMetadata(metadata) {
    this.setState({metadata})
  }

  handleHistory(history) {
    this.setState({
      history: history.slice().reverse().splice(1)
    })
  }

  toggleHistory(historyVisible) {
    this.setState({historyVisible})
  }

  renderHistory() {
    var { history } = this.state
    return (
      <div className="history" onClick={this.toggleHistory.bind(this, false)}>
        <span className="tidigare">Tidigare</span>
        {history.map(title => <div key={title}>{title}</div>)}
      </div>
    )
  }

  render() {
    var { metadata, historyVisible } = this.state
    return (
      <div id="on-air">
        <div className="avatar" />
        <div className="lol">
          <section>
            <img className="icon" src="/images/user.png" />
            <span className="meta fst">Host</span>
            <span className="meta">Oliver Johansson</span>
          </section>
          <section>
            <img className="icon" src="/images/play.png" />
            <span className="meta fst">Nu spelas</span>
            <span className="meta">{metadata.current}</span>
          </section>
          <section style={{marginBottom: 0}} onClick={this.toggleHistory.bind(this, true)}>
            <img className="icon" src="/images/clock.png" />
            <span className="meta fst">Tidigare</span>
            <span className="meta">{metadata.previous}</span>
          </section>
          {historyVisible && this.renderHistory()}
        </div>
        <Controls />
      </div>
    )
  }
}

module.exports = OnAir