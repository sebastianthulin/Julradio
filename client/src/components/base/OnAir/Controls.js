var React = require('react')
var RadioStore = require('../../../stores/RadioStore')

class Controls extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', this.handlePlaying.bind(this))
  }

  handlePlaying(playing) {
    this.setState({playing})
  }

  render() {
    var { playing } = this.state
    return (
      <button className="play-container" onClick={RadioStore.toggle}>
        {playing ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
        <span>{playing ? 'Pausa' : 'Starta Radio'}</span>
      </button>
    )
  }
}

module.exports = Controls