var React = require('react')

class OnAir extends React.Component {
  render() {
    return (
      <div id="on-air">
        <div className="avatar" />
        <div className="lol">
          <section className="fst">
            <img className="icon" src="/images/user.png" />
            <span className="meta">Host</span>
            <span className="meta-2">Oliver</span>
          </section>
          <section className="snd">
            <img className="icon" src="/images/play.png" />
            <span className="meta">Currently Playing</span>
            <span className="meta-2">The Darkness - Christmas Time (Don't Let The Bells End)</span>
          </section>
          <section className="trd">
            <img className="icon" src="/images/clock.png" />
            <span className="meta">Previously</span>
            <span className="meta-2">Bruce Springsteen - Santa Claus Is Coming To Town</span>
          </section>
        </div>
      </div>
    )
  }
}

module.exports = OnAir