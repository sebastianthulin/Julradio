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
      <div className="playBox">
        <button style={{color: '#FFF'}} onClick={Radio.toggle}>{playing ? 'Pausa' : 'Starta Radio'}</button>
      </div>
    )
  }
}

module.exports = Controls