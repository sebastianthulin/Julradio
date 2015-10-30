const React = require('react')
const { Link } = require('react-router')

class Admin extends React.Component {
  render() {
    return (
      <div id="Admin" className="row">
        <div className="navigation">
          <Link to="/admin/articles" activeClassName="active">Nyheter</Link>
          <a>Tävlingar</a>
          <Link to="/admin/users" activeClassName="active">Konton</Link>
          <Link to="/admin/schedule" activeClassName="active">Tablå</Link>
          <Link to="/admin/crew" activeClassName="active">Medarbetare</Link>
          <Link to="/admin/requests" activeClassName="active">Önskningar</Link>
        </div>
        {this.props.children}
      </div>
    )
  }
}

module.exports = Admin