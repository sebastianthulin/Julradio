const React = require('react')

class UserProfile extends React.Component {
  render() {
    return (
      <div className="row content">
        <div className="profileBox">
          <div className="profPicture"></div>
          <div className="profPM">Skicka Meddelande</div>
          <div className="profName">Oliver Johansson</div>
          <div className="profAge">Göteborg, 20 År</div>
          <div className="profText">
            <div className="profTextBox">Jag är en livs levande snigelfitta. Föddes den 29 december från mitt mammas anus - detta kan uppfattas som annorlunda och lite konstigt men redan från ung ålder valde jag att vandra min egen väg.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = UserProfile