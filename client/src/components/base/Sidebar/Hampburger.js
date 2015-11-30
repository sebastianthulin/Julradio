const React = require('react')
const { Link } = require('react-router')
const cx = require('classnames')

class Hampburger extends React.Component {
  render() {
    const { visible } = this.props
    return (
      <div id="Hampburger" className={cx({ visible })} ref="menu">
        <a target="_blank" href={"/"} className="media">Android app</a>
        <a target="_blank" href={"/"} className="media">iOS app</a>
        <a target="_blank" href={"http://www.winamp.com"} className="media">Winamp</a>
        <a target="_blank" href={"http://www.apple.com/se/itunes/download/"} className="media">iTunes</a>
      </div>
    )
  }
}

module.exports = Hampburger