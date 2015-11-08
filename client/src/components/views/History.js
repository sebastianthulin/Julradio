const React = require('react')
const RadioStore = require('../../stores/RadioStore')

const HistoryItem = ({ title }) => (
  <div className="HistoryItem">
    
  </div>
)

class History extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('currentlyPlaying', currentlyPlaying => this.setState({ currentlyPlaying }))
    RadioStore.subscribe('history', history => this.setState({
      history: history.slice().reverse().slice(1)
    }))
  }

  render() {
    const { currentlyPlaying, history } = this.state
    console.log(currentlyPlaying, history)
    return (
      <div id="History">
        jag är bög
      </div>
    )
  }
}

module.exports = History