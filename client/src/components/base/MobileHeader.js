const React = require('react')
const { Link } = require('react-router')
const UIStore = require('../../stores/UIStore')
const SVG = require('../svg')

class MobileHeader extends React.Component {
  render() {
    return (
      <div id="MobileHeader">
        <SVG.Menu onClick={UIStore.set.bind(null, 'SIDEBAR_OPEN')} />
        <Link to="/" className="logo">Julradio</Link>
      </div>
    )
  }
}

module.exports = MobileHeader