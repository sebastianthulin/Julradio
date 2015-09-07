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
      <div className="row content">
        <div className="three columns">
          <h1>Admin - Nyheter</h1>
          menu...
        </div>
        <div className="nine columns">
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