const React = require('react')
const { Link } = require('react-router')
const cx = require('classnames')

class Hampburger extends React.Component {
  render() {
    const { visible } = this.props
    return (
      <div id="Hampburger" className={cx({ visible })} ref="menu">
        <a target="_blank" href="https://play.google.com/store/apps/details?id=com.limani.julradio2013" className="media">Android app</a>
        <a target="_blank" href="https://itunes.apple.com/se/app/julradio/id582060389" className="media">iOS app</a>
        <a href="/lyssna.pls" className="media">VLC/Winamp</a>
        <a href="/lyssna.m3u" className="media">iTunes</a>
      </div>
    )
  }
}

module.exports = Hampburger