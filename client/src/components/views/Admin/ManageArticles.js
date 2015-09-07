var React = require('react')
var { Link } = require('react-router')
var NewsStore = require('../../../stores/NewsStore')
var Navigation = require('./Navigation')

class ManageArticles extends React.Component {
  componentWillMount() {
    console.log(this.props.param)
    NewsStore.get(this.handleArticles.bind(this))
  }

  componentWillReceiveProps() {
    console.log(this.props.param)
  }

  handleArticles(articles) {
    this.setState({articles})
  }

  render() {
    var { articles } = this.state
    return (
      <div>
        <div className="three columns">
          <h3>Admin - Nyheter</h3>
          <div className="list">
            {articles.map(article => <Link key={article._id} to={'/admin/articles/' + article._id}>{article.title}</Link>)}
          </div>
        </div>
        <div className="six columns article">
          <input type="text" defaultValue="Title of the article" />
          <textarea defaultValue="HELLO THIS IS THE TEXT IN THE ARTICLE THAT U CHOSE TO EDIT AND STUFF! WHAT U SAY ABOUT THAT NOW"></textarea>
          <div>
            <button>Uppdatera</button>
            <button style={{float: 'right', marginRight: 0}}>Ta Bort</button>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ManageArticles