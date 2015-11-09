const React = require('react')
const RadioStore = require('../../stores/RadioStore')

const HistoryItem = ({ title }) => (
  <div className="HistoryItem">
    {title}
  </div>
)

class History extends React.Component {
  componentWillMount() {
    this.unsub1 = RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    this.unsub2 = RadioStore.subscribe('history', history => this.setState({
      history: history.slice().reverse().slice(1)
    }))
  }

  compoenntWillUnmount() {
    this.unsub1()
    this.unsub2()
  }

  render() {
    const { currentlyPlaying, history } = this.state
    return (
      <div id="History">
        <HistoryItem {...currentlyPlaying} />
        {history.map(song => <HistoryItem key={song._id} {...song} />)}
      </div>
    )
  }
}

module.exports = History