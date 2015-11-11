const React = require('react')
const { Link } = require('react-router')
const RadioStore = require('../../../stores/RadioStore')
const ReservationStore = require('../../../stores/ReservationStore')
const VolumeSlider = require('./VolumeSlider')

class Player extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    RadioStore.subscribe('volume', volume => this.setState({ volume }))
    ReservationStore.subscribe('onair', program => this.setState({ program }))
  }

  toggleMute() {
    const { volume } = this.state
    RadioStore.setVolume( volume ? 0: 1 )
  }

  render() {
    var picture
    const { playing, currentlyPlaying, program, volume } = this.state

    if (program) {
      picture = program.picture || program.user && program.user.picture
    }
    return (
      <div id="Player">
        {picture && <img src={`/picture/${picture}`} />}
        <div div className="titleControls">
          <div className="controls">
            <div className="item">
              <i className={playing ? 'fa fa-pause' : 'fa fa-play'} onClick={RadioStore.toggle} />
            </div>
            <div className="item volumeControl">
              <i onClick={this.toggleMute.bind(this)} className={volume == 0 ? 'fa fa-volume-off' : 'fa fa-volume-up'} />
              <VolumeSlider />
            </div>
            <div className="host">{program ? program.user.name : 'Ingen värd'}</div>
          </div>
          <Link to="/history" className="songTitle">{currentlyPlaying.title}</Link>
        </div>
      </div>
    )
  }
}

module.exports = Player