var React = require('react')

class Footer extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div id="footer" className="row">
        <span className="footerLogo">Julradio</span>
        <div className="section">
          <div className="fRow"><div className="fRowOne">Ansvarig</div><div className="fRowTwo">boss@julradio.se</div></div>
          <div className="fRow"><div className="fRowOne">Radioansvarig</div><div className="fRowTwo">johan.gardemark@julradio.se</div></div>
          <div className="fRow"><div className="fRowOne">Webansvarig</div><div className="fRowTwo">web@julradio.se</div></div>
          <div className="fRow"><div className="fRowOne">Sponsor</div><div className="fRowTwo">sponsor@julradio.se</div></div>
          <div className="fRow"><div className="fRowOne">Sponsor</div><div className="fRowTwo">sponsor@julradio.se</div></div>
        </div>
        <div className="section">
          <div className="fRow"><div className="fRowOne">Radiopratare</div></div>
          <div className="fRow"><div className="fRowTwo">Thobias Bengtsson</div></div>
          <div className="fRow"><div className="fRowTwo">Ola Sterling</div></div>
          <div className="fRow"><div className="fRowTwo">Johan Abrahamsson</div></div>
          <div className="fRow"><div className="fRowTwo">Linus Nygren</div></div>
        </div>
        <div className="section">
          <div className="fRow"><div className="fRowOne">Radiopratare</div></div>
          <div className="fRow"><div className="fRowTwo">Pierre Andersson</div></div>
          <div className="fRow"><div className="fRowTwo">Joachim Kählman</div></div>
          <div className="fRow"><div className="fRowTwo">Alexander Jungå</div></div>
          <div className="fRow"><div className="fRowTwo">John Claesson</div></div>
        </div>
      </div>
    )
  }
}

module.exports = Footer