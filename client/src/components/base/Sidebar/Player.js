const React = require('react')
const {Link} = require('react-router')
const Hampburger = require('./Hampburger')
const SVG = require('../../svg')
const ProfilePicture = require('../../reusable/ProfilePicture')

class Player extends React.Component {
  openMediaMenu() {
    const menu = this.refs.hampburger.children[1]
    const hide = evt => {
      if (!menu.contains(evt.target)) {
        document.removeEventListener('mousedown', hide)
        this.setState({mediaMenu: false})
      }
    }
    document.addEventListener('mousedown', hide)
    this.setState({mediaMenu: true})
  }

  render() {
    const {props} = this
    const {onAir, nowPlaying} = props
    const {mediaMenu} = this.state || {}
    return (
      <div id="Player">
        {onAir && <div className="program">{onAir.get('description')}</div>}
        <div className="main">
          <div className="shit">
            {onAir && <ProfilePicture id={onAir.getIn(['user', 'picture'])} />}
            <div className="playPause" onClick={props.onTogglePlay} >
              <SVG.PlayPause pause={props.playing} />
            </div>
          </div>
          <div className="titleControls">
            <div className="controls">
              {onAir && (
                <Link className="host" to={'/@' + onAir.getIn(['user', 'username'])}>
                  {onAir.getIn(['user', 'name'])}
                </Link>
              )}
              <div className="item hampurgerMenu" ref="hampburger">
                <SVG.Dots className="dots" onClick={this.openMediaMenu.bind(this)} />
                <Hampburger
                  visible={mediaMenu}
                  volume={props.volume}
                  onSetVolume={props.onSetVolume}
                  onToggleMute={props.onToggleMute}
                />
              </div>
            </div>
            {nowPlaying && (
              <Link to="/history" className="songTitle">
                {nowPlaying.get('title')}
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Player
