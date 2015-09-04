var React = require('react')
var Radio = require('../../../services/Radio')

class Controls extends React.Component {
  componentWillMount() {
    Radio.subscribe(this.handleRadio.bind(this))
  }

  handleRadio(playing) {
    this.setState({playing})
  }

  render() {
    var { playing } = this.state
    return (
      <div>
        <button style={{color: '#FFF'}} onClick={Radio.toggle}>{playing ? 'Pause' : 'Play'}</button>
      </div>
    )
  }
}

module.exports = Controls