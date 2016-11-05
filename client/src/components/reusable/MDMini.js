const React = require('react')
const {browserHistory} = require('react-router')
const User = require('../../services/User')

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
  '/': '&#x2F;'
}

const parseContent = (markup = '') => {
  const username = (User.get() || {}).username
  let matchesNotMe

  markup = markup.replace(/[&<>"'\/]/g, s => entityMap[s])

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
  shouldComponentUpdate(props) {
    return props.text !== this.props.text
  }

  handleClick(ev) {
    if (ev.target.tagName === 'A' && ev.metaKey === false) {
      ev.preventDefault()
      browserHistory.push(ev.target.pathname)
    }
  }

  render() {
    const {text, ...rest} = this.props
    const __html = parseContent(text)
    return <div
      onClick={this.handleClick.bind(this)}
      dangerouslySetInnerHTML={{__html}}
      {...rest}
    />
  }
}

module.exports = MDMini
