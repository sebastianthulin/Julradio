const React = require('react')

class Modal extends React.Component {
  render() {
    const {children, className} = this.props
    return <div
      className={'Modal ' + className}
      children={children}
    />
  }
}

module.exports = Modal
