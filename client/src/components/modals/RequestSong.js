var React = require('react')

class RequestSong extends React.Component {
  componentDidMount() {
    this.updateHref()
  }
  componentWillMount() {
    this.state = {}
  }
  updateHref() {
    var resultString = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Jag vill höra "' + this.refs.songName.getDOMNode().value + '" ' + this.refs.text.getDOMNode().value + ' #julradio');
    this.setState({
      url: resultString
    })
  }
  render() {
    return (
      <div className="modal">
        <header>
          Önska en låt
        </header>
        <main>
          <input type="text" placeholder="Ditt Namn"/>
          <input type="text" onChange={this.updateHref.bind(this)} ref="songName" placeholder="Låt"/>
          <textarea type="text" onChange={this.updateHref.bind(this)} ref="text" placeholder="Text" />
          <button>Skicka önskning</button>
          <button><a target="_blank" href={this.state.url}>Önska via twitter</a></button>
        </main>
      </div>
    )
  }
}

module.exports = RequestSong