const React = require('react')
const { Link } = require('react-router')
const RadioStore = require('../../../stores/RadioStore')
const ReservationStore = require('../../../stores/ReservationStore')
const Hampburger = require('./Hampburger')
const SVG = require('../../svg')
const ProfilePicture = require('../../reusable/ProfilePicture')

class Player extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    RadioStore.subscribe('volume', volume => this.setState({ volume }))
    ReservationStore.subscribe('onair', program => this.setState({ program }))
  }

  openMediaMenu() {
    const menu = this.refs.hampburger.children[1]
    const hide = ev => {
      if (!menu.contains(ev.target)) {
        document.removeEventListener('mousedown', hide)
        this.setState({mediaMenu: false})
      }
    }
    document.addEventListener('mousedown', hide)
    this.setState({mediaMenu: true})
  }

  toggleMute() {
    RadioStore.toggleMute()
  }

  render() {
    const { playing, currentlyPlaying, program, volume, mediaMenu } = this.state
    return (
      <div id="Player">
        {program && <div className="program">{program.description}</div>}
        <div className="main">
          <div className="shit">
            {program && <ProfilePicture id={program.user.picture} />}
            <div className="playPause" onClick={RadioStore.toggle} >
              <SVG.PlayPause pause={playing} />
            </div>
          </div>
          <div div className="titleControls">
            <div className="controls">
              {program && <Link className="host" to={'/@' + program.user.username} children={program.user.name} />}
              {!program && <div className="host">Slingan</div>}
              <div className="item hampurgerMenu" ref="hampburger">
                <SVG.Dots className="dots" onClick={this.openMediaMenu.bind(this)} />
                <Hampburger visible={mediaMenu} volume={volume} />
              </div>
            </div>
            <Link to="/history" className="songTitle">{currentlyPlaying.title}</Link>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Player