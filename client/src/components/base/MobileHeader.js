const React = require('react')
const { Link } = require('react-router')
const UIStore = require('../../stores/UIStore')

class MobileHeader extends React.Component {
  render() {
    return (
      <div id="MobileHeader">
        <button onClick={UIStore.set.bind(null, 'SIDEBAR_OPEN')}>menu</button>
        <Link to="/" className="logo">Julradio</Link>
      </div>
    )
  }
}

module.exports = MobileHeader