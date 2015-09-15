var React = require('react')
var { Link } = require('react-router')
var RadioStore = require('../../stores/RadioStore')
var Modal = require('../../services/Modal')

class Header extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', this.handlePlaying.bind(this))
    RadioStore.subscribe('metadata', this.handleMetadata.bind(this))
  }

  handlePlaying(playing) {
    this.setState({playing})
  }

  handleMetadata(metadata) {
    this.setState({metadata})
  }

  render() {
    var { playing, metadata } = this.state
    return (
      <div id="header-v2" className="row">
        <div className="two columns">
          <Link to="/" className="logo">Julradio</Link>
          <Link to="/admin/articles">Administration</Link>
        </div>
        <div className="eight columns">
          <div className="now-playing">
            <span className="meta">Just nu:</span>
            <span className="title">{metadata.current}</span>
            <button className="play-container-v2" onClick={RadioStore.toggle}>
              <i className={playing ? 'fa fa-pause' : 'fa fa-play'} />
            </button>
          </div>
          <div className="host">
            <div className="avatar" />
            <div className="meta">
              <div className="meta-1">Host:</div>
              <div className="meta-2">Oliver Johansson</div>
            </div>
          </div>
        </div>
        <div className="two columns">
          <button className="login-btn" onClick={Modal.open.bind(null, 'LogIn')}>Logga in</button>
        </div>


      </div>
    )
  }
}

module.exports = Header