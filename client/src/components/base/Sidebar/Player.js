const React = require('react')
const RadioStore = require('../../../stores/RadioStore')
const VolumeSlider = require('./VolumeSlider')

class Player extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    RadioStore.subscribe('history', history => this.setState({
      history: history.slice().reverse().slice(1)
    }))
  }

  render() {
    const { playing, currentlyPlaying, history } = this.state || {}
    return (
      <div id="player">
        <img src="/images/berkleyill.jpg" />
        <div div className="title-controls">
          {currentlyPlaying.title}
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