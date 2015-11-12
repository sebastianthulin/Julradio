const React = require('react')
const cx = require('classnames')

class Modal extends React.Component {
  componentWillMount() {
    requestAnimationFrame(() => this.setState({animateIn: true}))
  }

  render() {
    const { children, className } = this.props
    const { animateIn } = this.state || {}
    return <div
      className={cx('Modal', className, { animateIn })}
      children={children}
    />
  }
}

module.exports = Modal