const React = require('react')
const RadioStore = require('../../../stores/RadioStore')

class Avatar extends React.Component {
  render() {
    const { playing } = this.props
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