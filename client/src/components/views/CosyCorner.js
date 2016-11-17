const React = require('react')
const Comments = require('../reusable/Comments')

class CosyCorner extends React.Component {
  render() {
    return (
      <div id="CosyCorner">
        <h1>Myshörnan</h1>
        <Comments
          type="cosyCorner"
          target={true}
          placeholder="Skriv något i myshörnan"
          signInPlaceholder="Logga in för att ta del av myset"
        />
      </div>
    )
  }
}

module.exports = CosyCorner
