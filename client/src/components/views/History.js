const React = require('react')
const {connect} = require('react-redux')
const cx = require('classnames')
const {setHistoryView, fetchMostPlayed} = require('../../actions/player')

const HistoryItem = ({songTitle, playCount}) => (
  <div className="HistoryItem">
    {playCount !== undefined && playCount + ' - '}
    {songTitle}
  </div>
)

@connect(state => ({
  historyView: state.player.get('historyView'),
  recent: state.player.get('recent'),
  mostPlayed: state.player.get('mostPlayed')
}), {
  onSetHistoryView: setHistoryView,
  onFetchMostPlayed: fetchMostPlayed
})
class History extends React.Component {
  componentWillMount() {
    this.props.onFetchMostPlayed()
  }

  render() {
    const {mostPlayed, historyView, onSetHistoryView} = this.props
    const recent = this.props.recent.reverse()

    return (
      <div id="History">
        <button className={cx({active: historyView === 'recent'})} onClick={() => onSetHistoryView('recent')}>
          30 senaste
        </button>
        <button className={cx({active: historyView === 'mostPlayed'})} onClick={() => onSetHistoryView('mostPlayed')}>
          50 mest spelade
        </button>
        {historyView === 'recent' && recent.map(song => (
          <HistoryItem
            key={song.get('_id')}
            songTitle={song.get('title')}
          />
        ))}
        {historyView === 'mostPlayed' && mostPlayed.map(song => (
          <HistoryItem
            key={song.get('title')}
            songTitle={song.get('title')}
            playCount={song.get('playCount')}
          />
        ))}
      </div>
    )
  }
}

module.exports = History
