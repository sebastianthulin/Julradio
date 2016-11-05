const React = require('react')
const cx = require('classnames')

class VolumeSlider extends React.Component {
  initDrag(evt) {
    evt.preventDefault()
    this.handleDrag(evt)
    const handleDrag = this.handleDrag.bind(this)
    const endDrag = () => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', endDrag)
      this.setState({adjusting: false})
    }
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', endDrag)
    this.setState({adjusting: true})
  }

  handleDrag(evt) {
    const rect = this.refs.slider.getBoundingClientRect()
    const offsetLeft = evt.clientX - rect.left
    const vol1 = offsetLeft / rect.width
    const vol = vol1 > 1 ? 1 : vol1 < 0 ? 0 : vol1
    this.props.onSetVolume(vol)
  }

  render() {
    const {volume} = this.props
    const {adjusting} = this.state || {}
    return (
      <div id="VolumeSlider" className={cx({adjusting})} ref="slider" onMouseDown={this.initDrag.bind(this)}>
        <div className="volume" style={{width: volume * 100 + '%'}}>
          <div className="handle" />
        </div>
      </div>
    )
  }
}

module.exports = VolumeSlider
