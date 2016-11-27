const React = require('react')
const Comments = require('../reusable/Comments')

class CosyCorner extends React.Component {
  render() {
    return (
      <div>
        <div id="CosyCorner">
          <h1>Myshörnan</h1>
          <Comments
            type="cosyCorner"
            target={true}
            placeholder="Skriv något i myshörnan"
            signInPlaceholder="Logga in för att ta del av myset"
          />
        </div>
        <div id="OnlineList">
          <h1>Online</h1>
          <div className="search"><img src="/images/search.svg" /></div>
          <div className="person">
            <div className="picture"></div>
            <div className="username">Reddan</div>
          </div>
          <div className="person">
            <div className="picture"></div>
            <div className="username">Glutch</div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = CosyCorner
