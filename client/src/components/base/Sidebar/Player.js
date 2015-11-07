const React = require('react')
const { Link } = require('react-router')
const RadioStore = require('../../../stores/RadioStore')
const ReservationStore = require('../../../stores/ReservationStore')
const VolumeSlider = require('./VolumeSlider')

class Player extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    ReservationStore.subscribe('onair', program => this.setState({ program }))
  }

  render() {
    var picture
    const { playing, currentlyPlaying, program } = this.state

    if (program) {
      picture = program.picture || program.user && program.user.picture
    }

    return (
      <div id="Player">
        {picture && <img src={`/i/${picture._id + picture.extension}`} />}
        <div div className="titleControls">
          <Link to="/history" className="songTitle">{currentlyPlaying.title}</Link>
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