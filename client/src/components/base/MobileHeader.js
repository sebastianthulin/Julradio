const React = require('react')
const { Link } = require('react-router')
const UIStore = require('../../stores/UIStore')

class MobileHeader extends React.Component {
  render() {
    return (
      <div id="MobileHeader">
        <button className="openMenu" onClick={UIStore.set.bind(null, 'SIDEBAR_OPEN')}>
          <i className="fa fa-bars" />
        </button>
        <Link to="/" className="logo">Julradio</Link>
      </div>
    )
  }
}

module.exports = MobileHeader