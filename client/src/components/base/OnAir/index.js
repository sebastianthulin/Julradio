var React = require('react')
var RadioStore = require('../../../stores/RadioStore')
var Avatar = require('./Avatar')
var VolumeSlider = require('./VolumeSlider')

class OnAir extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('metadata', metadata => this.setState({metadata}))
    // RadioStore.subscribe.history(this.handleHistory.bind(this))
  }

  render() {
    var { metadata } = this.state
    return (
      <div id="on-air">
        <div className="info" style={{marginBottom: 10}}>
          <span className="meta-1">Host</span>
          <span className="meta-2">Oliver Johansson</span>
        </div>
        <Avatar />
        <VolumeSlider />
        <div className="info">
          <span className="meta-1">Nu spelas</span>
          <span className="meta-2">{metadata.current}</span>
        </div>
      </div>
    )
  }
}

module.exports = OnAir