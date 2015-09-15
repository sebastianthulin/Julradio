var React = require('react')
var NewsStore = require('../../../stores/NewsStore')

class ManageArticle extends React.Component {
  componentWillMount() {
    this.id = this.props.article._id
  }

  save() {
    NewsStore.update(this.id, {
      title: this.refs.title.getDOMNode().value,
      text: this.refs.text.getDOMNode().value
    })
  }

  delete() {
    NewsStore.delete(this.id)
  }

  render() {
    var { article } = this.props
    return (
      <div className="six columns article">
        <input ref="title" defaultValue={article.title} />
        <textarea ref="text" defaultValue={article.text} />
        <div>
          <button onClick={this.save.bind(this)}>Spara</button>
          <button style={{float: 'right', marginRight: 0}} onClick={this.delete.bind(this)}>Ta Bort</button>
        </div>
      </div>
    )
  }
}

module.exports = ManageArticle