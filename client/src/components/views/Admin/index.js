const React = require('react')
const cx = require('classnames')
const { Link } = require('react-router')

class Admin extends React.Component {
  render() {
    const { path } = this.props.routes[2]
    return (
      <div id="Admin" className="row">
        <div className="navigation">
          <Link
            to="/admin/articles"
            className={cx({active: path === 'articles(/:id)'})}
            children="Nyheter"
          />
          <a>Tävlingar</a>
          <Link
            to="/admin/users"
            className={cx({active: path === 'users(/:username)'})}
            children="Konton"
          />
          <Link
            to="/admin/reservations"
            className={cx({active: path === 'reservations'})}
            children="Bokningar"
          />
          <Link
            to="/admin/crew"
            className={cx({active: path === 'crew'})}
            children="Medarbetare"
          />
          <Link
            to="/admin/requests"
            className={cx({active: path === 'requests'})}
            children="Önskningar"
          />
        </div>
        {this.props.children}
      </div>
    )
  }
}

module.exports = Admin