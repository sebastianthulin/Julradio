const React = require('react')
const { connect } = require('react-redux')
const { Link } = require('react-router')
const { setVisibility } = require('../../actions/visibility')
const SVG = require('../svg')

class MobileHeader extends React.Component {
  render() {
    const { setVisibility } = this.props
    return (
      <div id="MobileHeader">
        <SVG.Menu onClick={() => setVisibility('sidebar', 'SIDEBAR_OPEN')} />
        <Link to="/" className="logo">Julradio</Link>
      </div>
    )
  }
}

module.exports = connect(
  null,
  dispatch => ({
    setVisibility: (ui, filter) => dispatch(setVisibility(ui, filter))
  })
)(MobileHeader)