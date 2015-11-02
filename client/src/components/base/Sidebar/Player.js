const React = require('react')
const { Link } = require('react-router')
const RadioStore = require('../../../stores/RadioStore')
const VolumeSlider = require('./VolumeSlider')

class Player extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
  }

  render() {
    const { playing, currentlyPlaying, history } = this.state
    return (
      <div id="Player">
        <img src="/images/berkleyill.jpg" />
        <div div className="titleControls">
          <Link href="/history" className="songTitle">{currentlyPlaying.title}</Link>
          <div className="controls">
            <i className={playing ? 'fa fa-pause' : 'fa fa-play'} onClick={RadioStore.toggle} />
            <VolumeSlider />
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Player