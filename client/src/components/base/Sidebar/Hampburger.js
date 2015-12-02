const React = require('react')
const SVG = require('../../svg')
const RadioStore = require('../../../stores/RadioStore')
const VolumeSlider = require('./VolumeSlider')
const { Link } = require('react-router')
const cx = require('classnames')

class Hampburger extends React.Component {
  render() {
    const { visible, volume } = this.props
    return (
      <div id="Hampburger" className={cx({ visible })} ref="menu">
        <div className="volumeControl">
          <div className="volumeButton">
            <SVG.Volume volume={volume} onClick={RadioStore.toggleMute.bind(RadioStore)} />
          </div>
          <VolumeSlider />
        </div>
        <a target="_blank" href="https://play.google.com/store/apps/details?id=com.limani.julradio2013" className="media"><img src="/images/android.svg"/>Android</a>
        <a target="_blank" href="https://itunes.apple.com/se/app/julradio/id582060389" className="media"><img src="/images/apple.svg"/>iOS app</a>
        <a href="/lyssna.pls" className="media"><img src="/images/vlc.svg"/>VLC/Winamp</a>
        <a href="/lyssna.m3u" className="media"><img src="/images/itunes.svg"/>iTunes</a>
      </div>
    )
  }
}

module.exports = Hampburger