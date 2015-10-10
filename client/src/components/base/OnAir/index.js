const React = require('react')
const cx = require('classnames')
const RadioStore = require('../../../stores/RadioStore')
const UIStore = require('../../../stores/UIStore')
const Snowfall = require('../../base/Snowfall')
const Avatar = require('./Avatar')
const VolumeSlider = require('./VolumeSlider')
const NowPlaying = require('./NowPlaying')

class OnAir extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('onair', onair => this.setState({ onair }))
    UIStore.subscribe('NowPlaying', nowPlayingVisibility => this.setState({
      nowPlayingVisibility
    }))
  }

  render() {
    const { playing, onair, nowPlayingVisibility } = this.state
    const { CURRENT_ONLY, HISTORY } = nowPlayingVisibility
    return (
      <div id="on-air" className={cx({ya: HISTORY})}>
        <Snowfall
          active={onair}
          count={500}
          minSize={1}
          maxSize={2}
          minSpeed={0.5}
          maxSpeed={2}
        />
        <div className="flex-container">
          <div className="host">
            <span className="meta">Host</span>
            <span>Oliver Johansson</span>
          </div>
          <Avatar playing={playing} />
          <VolumeSlider />
          <NowPlaying />
        </div>
      </div>
    )
  }
}

module.exports = OnAir