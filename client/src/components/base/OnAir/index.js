var React = require('react')
var Radio = require('../../../services/Radio')
var Controls = require('./Controls')

class OnAir extends React.Component {
  componentWillMount() {
    Radio.subscribe('metadata', this.handleMetadata.bind(this))
  }

  handleMetadata(metadata) {
    this.setState({metadata})
  }

  render() {
    var { metadata } = this.state
    return (
      <div id="on-air">
        <div className="avatar" />
        <div className="lol">
          <section className="fst">
            <img className="icon" src="/images/user.png" />
            <span className="meta">Host</span>
            <span className="meta-2">Oliver Johansson</span>
          </section>
          <section className="snd">
            <img className="icon" src="/images/play.png" />
            <span className="meta">Nu spelas</span>
            <span className="meta-2">{metadata.current}</span>
          </section>
          <section className="trd">
            <img className="icon" src="/images/clock.png" />
            <span className="meta">Tidigare</span>
            <span className="meta-2">{metadata.previous}</span>
          </section>
        </div>
        <Controls />
      </div>
    )
  }
}

module.exports = OnAir