var React = require('react')

class Header extends React.Component {
  render() {
    return (
      <div id="header">
        <div className="logo">
          Julradio
          <span className="slogan">Nätets Bästa Julmusik</span>
        </div>
        <div className="listen">
          <span>Lyssna nu!</span>
          <div className="btn">
            <img src="/images/winamp_small.png" />
          </div>
          <div className="btn">
            <img src="/images/android_small.png" />
          </div>
          <div className="btn">
            <img src="/images/windows_small.png" />
          </div>
          <div className="btn">
            <img src="/images/apple_small.png" />
          </div>
          <div className="btn">
            <img src="/images/internet_small.png" />
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Header