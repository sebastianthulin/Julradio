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
        <div className="four columns">
          <h3>Admin - Nyheter</h3>
          <div className="list">
            {articles.map(article => (
              <div>
                {article.title}
              </div>
            ))}
          </div>
        </div>
        <div className="five columns article">
          <h4><input type="text" defaultValue="Title of the article" /><br /></h4>
          <textarea>HELLO THIS IS THE TEXT IN THE ARTICLE THAT U CHOSE TO EDIT AND STUFF! WHAT U SAY ABOUT THAT NOW </textarea>
          <div>
            <button>Uppdatera</button>
            <button style={{float: 'right', marginRight: 0}}>Ta Bort</button>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = AdminPage