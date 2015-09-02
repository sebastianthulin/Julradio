var React = require('react')

class TwitterWidget extends React.Component {
  componentDidMount() {
    var link = this.refs.link.getDOMNode()
    var js = document.createElement('script')
    js.id = 'twitter-wjs'
    js.src = '//platform.twitter.com/widgets.js'
    link.parentNode.appendChild(js)
  }

  render() {
    return (
      <a
        ref="link"
        className="twitter-timeline"
        href={this.props.path}
        data-widget-id={this.props.id}
      />
    )
  }
}

module.exports = TwitterWidget