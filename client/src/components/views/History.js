const React = require('react')
const {connect} = require('react-redux')

const HistoryItem = ({song}) => (
  <div className="HistoryItem">
    {song.get('title')}
  </div>
)

@connect(state => ({
  history: state.player.get('history')
}))
class History extends React.Component {
  render() {
    const history = this.props.history.reverse()
    return (
      <div id="History">
        {history.map(song => <HistoryItem key={song.get('_id')} song={song} />)}
      </div>
    )
  }
}

module.exports = History
