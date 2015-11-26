const User = require('./User')

function parseComment(markup) {
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

module.exports = parseComment