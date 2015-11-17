const React = require('react')
const { Link } = require('react-router')
const RadioStore = require('../../../stores/RadioStore')
const ReservationStore = require('../../../stores/ReservationStore')
const VolumeSlider = require('./VolumeSlider')
const SVG = require('../../svg')

class Player extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    RadioStore.subscribe('volume', volume => this.setState({ volume }))
    ReservationStore.subscribe('onair', program => this.setState({ program }))
  }

  toggleMute() {
    RadioStore.toggleMute()
  }

  render() {
    var picture
    const { playing, currentlyPlaying, program, volume } = this.state

    if (program) {
      picture = program.picture || program.user && program.user.picture
    }

    return (
      <div id="Player">
        {program && <div className="program">{program.description}</div>}
        <div className="main">
          {picture && <img src={`/picture/${picture}`} />}
          <div div className="titleControls">
            <div className="controls">
              <div className="item">
                <SVG.PlayPause pause={playing} onClick={RadioStore.toggle} />
              </div>
              <div className="item volumeControl">
                <SVG.Volume volume={volume} onClick={this.toggleMute.bind(this)} />
                <VolumeSlider />
              </div>
              {program && <Link className="host" to={'/@' + program.user.username} children={program.user.name} />}
              {!program && <div className="host">Ingen värd</div>}
            </div>
            <Link to="/history" className="songTitle">{currentlyPlaying.title}</Link>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Player