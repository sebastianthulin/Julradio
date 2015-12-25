const React = require('react')
const { connect } = require('react-redux')
const { Link } = require('react-router')
const RadioStore = require('../../../stores/RadioStore')
const Hampburger = require('./Hampburger')
const SVG = require('../../svg')
const ProfilePicture = require('../../reusable/ProfilePicture')

class Player extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({ playing }))
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    RadioStore.subscribe('volume', volume => this.setState({ volume }))
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
    const { onAir } = this.props
    const { playing, currentlyPlaying, volume, mediaMenu } = this.state
    return (
      <div id="Player">
        {onAir && <div className="program">{onAir.get('description')}</div>}
        <div className="main">
          <div className="shit">
            {onAir && <ProfilePicture id={onAir.getIn(['user', 'picture'])} />}
            <div className="playPause" onClick={RadioStore.toggle} >
              <SVG.PlayPause pause={playing} />
            </div>
          </div>
          <div div className="titleControls">
            <div className="controls">
              {onAir && <Link className="host" to={'/@' + onAir.getIn(['user', 'username'])} children={onAir.getIn(['user', 'name'])} />}
              {!onAir && <div className="host">Slingan</div>}
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

module.exports = connect(
  state => ({
    onAir: state.reservations.get('onAir')
  })
)(Player)