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
      <div className="playBox">
        <button style={{color: '#FFF'}} onClick={RadioStore.toggle}>{playing ? 'Pausa' : 'Starta Radio'}</button>
      </div>
    )
  }
}

module.exports = Controls