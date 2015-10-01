const React = require('react')

class UserProfile extends React.Component {
  render() {
    return (
      <div className="row content">
        <div className="profileBox">
          <div className="friends">

            <div className="friend">
              <div className="picture"></div>
              <div className="namn">Oliver Johansson</div>
            </div>

            <div className="friend">
              <div className="picture"></div>
              <div className="namn">Hampus Hallman</div>
            </div>
          
          </div>
          <div className="chat">
            <div className="message">
              <div className="left">Hello</div>
            </div>
            <div className="message">
              <div className="right">Fagget</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = UserProfile