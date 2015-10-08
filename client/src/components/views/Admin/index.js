var React = require('react')
var Navigation = require('./Navigation')

class Admin extends React.Component {
  render() {
    return (
      <div id="admin" className="row content">
        <Navigation />
        {this.props.children}
      </div>
    )
  }
}

module.exports = Admin