const React = require('react')
const {Link} = require('react-router')
const cx = require('classnames')
const ProfilePicture = require('../reusable/ProfilePicture')

class Notification extends React.Component {
  componentDidMount() {
    this.props.onHeight(this.refs.node.clientHeight)
  }

  handleClick() {
    this.props.onClearNotification(this.props.notification.get('id'))
  }

  render() {
    const {notification, y} = this.props
    const err = notification.get('isError')
    const from = notification.get('from')
    const metadata = notification.get('metadata')
    const url = metadata.get('url')

    const style = {
      transform: `translateY(${y}px)`
    }

    const dom = (
      <div ref="node" className={cx('Notification', {err})} style={style} onClick={this.handleClick.bind(this)}>
        {from && <ProfilePicture id={from.get('picture')} />}
        {metadata.get('message')}
      </div>
    )

    return url ? <Link to={url} children={dom} /> : dom
  }
}

module.exports = Notification
