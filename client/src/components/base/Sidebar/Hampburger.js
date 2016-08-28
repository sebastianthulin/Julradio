const React = require('react')
const {Link} = require('react-router')
const cx = require('classnames')
const RadioStore = require('../../../stores/RadioStore')
const SVG = require('../../svg')
const VolumeSlider = require('./VolumeSlider')

class Hampburger extends React.Component {
  render() {
    const {visible, volume} = this.props
    return (
      <div id="Hampburger" className={cx({visible})}>
        <div className="volumeControl">
          <SVG.Volume volume={volume} onClick={RadioStore.toggleMute.bind(RadioStore)} />
          <VolumeSlider />
        </div>
        <a target="_blank" href="https://play.google.com/store/apps/details?id=com.limani.julradio2013" className="media">
          <SVG.Android />
          Android
        </a>
        <a target="_blank" href="https://itunes.apple.com/se/app/julradio/id582060389" className="media">
          <SVG.Apple />
          iOS app
        </a>
        <a href="/lyssna.pls" className="media">
          <SVG.VLC />
          VLC/Winamp
        </a>
        <a href="/lyssna.m3u" className="media">
          <SVG.iTunes />
          iTunes
        </a>
      </div>
    )
  }
}

module.exports = Hampburger
