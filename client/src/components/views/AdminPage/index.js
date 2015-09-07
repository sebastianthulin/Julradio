var React = require('react')
var NewsStore = require('../../../stores/NewsStore')

class AdminPage extends React.Component {
  componentWillMount() {
    NewsStore.get(this.handleArticles.bind(this))
  }

  handleArticles(articles) {
    this.setState({articles})
  }

  render() {
    var { articles } = this.state
    return (
      <div id="admin" className="row content">
        <div className="three columns">
          <div className="group">
            <h4>Hantering</h4>
            <a className="tab">Nyheter</a>
            <a className="tab">Konton</a>
            <a className="tab">Tävlingar</a>
            <a className="tab">Poll</a>
          </div>
          <div className="group">
            <h4>Notiser</h4>
            <a className="tab">Önskningar (32)</a>
            <a className="tab">Granska profilbilder (4)</a>
            <a className="tab">Kommentarer (6)</a>
          </div>
        </div>
        <div className="nine columns">
          <h3>Admin - Nyheter</h3>
          {articles.map(article => (
            <div>
              {article.title}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

module.exports = AdminPage