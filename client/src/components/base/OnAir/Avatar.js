var React = require('react')
var RadioStore = require('../../../stores/RadioStore')

class Avatar extends React.Component {
  componentWillMount() {
    RadioStore.subscribe('playing', playing => this.setState({playing}))
  }

  render() {
    var { playing } = this.state
    return (
      <div className="avatar">
        <div className="image" onClick={RadioStore.toggle}>
          <div className="play-status">
            <i className={playing ? 'fa fa-pause' : 'fa fa-play'} />
            <span>{playing ? 'Pausa' : 'Starta Radio'}</span>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Avatar