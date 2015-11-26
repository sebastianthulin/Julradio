const React = require('react')

class History extends React.Component {
  render() {
    return (
      <div id="NotFound">
        <h1>{this.props.referingTo || "Sidan"} hittades inte</h1>
        <img src="/images/santa.png" alt="Santa" />
      </div>
    )
  }
}

module.exports = History