const React = require('react')
const Comments = require('../reusable/Comments')

class CosyCorner extends React.Component {
  render() {
    return (
      <div id="CosyCorner">
        <h1>Myshörnan</h1>
        <Comments
          type="cosycorner"
          placeholder="Skriv något i myshörnan"
        />
      </div>
    )
  }
}

module.exports = CosyCorner