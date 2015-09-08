var React = require('react')
var NewsStore = require('../../../stores/NewsStore')

class ManageArticle extends React.Component {
  componentWillMount() {
    NewsStore.whatever(this.props.article._id)
  }

  save() {
    NewsStore.update({
      _id: this.props.article._id,
      title: this.refs.title.getDOMNode().value,
      text: this.refs.text.getDOMNode().value
    })
  }

  render() {
    var { article } = this.props
    return (
      <div className="six columns article">
        <input ref="title" defaultValue={article.title} />
        <textarea ref="text" defaultValue={article.text} />
        <div>
          <button onClick={this.save.bind(this)}>Uppdatera</button>
          <button style={{float: 'right', marginRight: 0}}>Ta Bort</button>
        </div>
      </div>
    )
  }
}

module.exports = ManageArticle