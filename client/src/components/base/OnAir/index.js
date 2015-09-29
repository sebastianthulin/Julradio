const React = require('react')
const RadioStore = require('../../../stores/RadioStore')
const Snowfall = require('../../base/Snowfall')
const Avatar = require('./Avatar')
const VolumeSlider = require('./VolumeSlider')

class OnAir extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({playing}))
    RadioStore.subscribe('metadata', metadata => this.setState({metadata}))
    // RadioStore.subscribe.history(this.handleHistory.bind(this))
  }

  render() {
    var { playing, metadata } = this.state
    return (
      <div id="on-air">
        <Snowfall
          active={playing}
          count={500}
          minSize={1}
          maxSize={2}
          minSpeed={0.5}
          maxSpeed={2}
        />
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