var React = require('react')
var Navigation = require('./Navigation')

class Admin extends React.Component {
  render() {
    return (
      <div id="admin" className="row">
        <Navigation />
        {this.props.children}
      </div>
    )
  }
}

module.exports = Admin