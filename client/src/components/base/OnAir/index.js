var React = require('react')
var { Link } = require('react-router')
var RadioStore = require('../../../stores/RadioStore')
var Controls = require('./Controls')

class OnAir extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('metadata', this.handleMetadata.bind(this))
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
            <Link to="/historik" className="meta">Tidigare</Link>
            <span className="meta-2">{metadata.previous}</span>
          </section>
        </div>
        <Controls />
      </div>
    )
  }
}

module.exports = OnAir