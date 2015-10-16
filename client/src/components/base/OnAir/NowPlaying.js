const React = require('react')
const cx = require('classnames')
const RadioStore = require('../../../stores/RadioStore')
const UIStore = require('../../../stores/UIStore')

class NowPlaying extends React.Component {
  componentWillMount() {
    this.state = {}
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    RadioStore.subscribe('history', history => this.setState({ history }))
    UIStore.subscribe('NowPlaying', visibility => this.setState({ visibility }))
  }

  toggle() {
    const { CURRENT_ONLY } = this.state.visibility
    const UIState = CURRENT_ONLY ? 'HISTORY' : 'CURRENT_ONLY'
    UIStore.set('NowPlaying', UIState)
  }

  renderHistory() {
    var history = this.state.history.slice().reverse().slice(1)
    return (
      <div>
        <span className="meta">Tidigare:</span>
        {history.map(song => <span key={song.date}>{song.title}</span>)}
      </div>
    )
  }

  render() {
    const { currentlyPlaying, visibility } = this.state
    const { CURRENT_ONLY, HISTORY } = visibility
    const className = cx('now-playing', { big: HISTORY })
    return (
      <div className={className} onClick={this.toggle.bind(this)}>
        <span className="meta">Nu spelas</span>
        <span>{currentlyPlaying.title}</span>
        {HISTORY && this.renderHistory()}
      </div>
    )
  }
}

module.exports = NowPlaying