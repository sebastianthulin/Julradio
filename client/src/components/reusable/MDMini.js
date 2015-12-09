const React = require('react')
const User = require('../../services/User')
const history = require('../../services/history')

function parseContent(markup = '') {
  const username = (User.get() || {}).username
  var matchesNotMe

  markup = markup
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  if (username) {
    // user signed in, match all mentions except for @${username}
    const matchesMe = `@(${username})(?!\\\w+)`
    matchesNotMe = `@((?!${username}(?!\\\w+))\\\w+)`
    markup = markup.replace(new RegExp(matchesMe, 'ig'), '<a href="/@$1" class="highlight">@$1</a>')
  } else {
    // user not signed in, match all mentions
    matchesNotMe = `@(\\\w+)(?!\\\w+)`
  }

  return markup
    .replace(/\n/g, '<br />')
    .replace(/:tomten:/g, '<img class="emoji" alt=":tomten:" src="/images/santa-small.png" />')
    .replace(new RegExp(matchesNotMe, 'ig'), '<a href="/@$1">@$1</a>')
}

class MDMini extends React.Component {
  componentWillMount() {
    this.parse(this.props.text)
  }

  componentWillReceiveProps(props) {
    if (props.text !== this.props.text) {
      this.parse(props.text)
    }
  }

  parse(text) {
    this.setState({
      content: {
        __html: parseContent(text)
      }
    })
  }

  handleClick(ev) {
    if (ev.target.tagName === 'A' && ev.metaKey === false) {
      ev.preventDefault()
      history.push(ev.target.pathname)
    }
  }

  render() {
    const { content } = this.state
    return <div
      onClick={this.handleClick.bind(this)}
      dangerouslySetInnerHTML={content}
      {...this.props}
    />
  }
}

module.exports = MDMini