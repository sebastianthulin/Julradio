const React = require('react')
const {connect} = require('react-redux')
const Comments = require('../reusable/Comments')

@connect(state => ({
  onlineList: state.onlineList
}))
class CosyCorner extends React.Component {
  shouldComponentUpdate(props) {
    return props.onlineList !== this.props.onlineList
  }

  render() {
    return (
      <div id="CosyCorner">
        <h1>Myshörnan</h1>
        {this.props.onlineList.map(username =>
          <div key={username}>{username}</div>
        )}
        <Comments
          type="cosycorner"
          placeholder="Skriv något i myshörnan"
          signInPlaceholder="Logga in för att ta del av myset"
        />
      </div>
    )
  }
}

module.exports = CosyCorner
