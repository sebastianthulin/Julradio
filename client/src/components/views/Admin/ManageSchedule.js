const React = require('react')
const ArticleStore = require('../../../stores/ArticleStore')

class ManageSchedule extends React.Component {
  componentWillMount() {
    ArticleStore.getSchedule(schedule => this.setState({ schedule }))
  }

  save() {
    const text = this.refs.textarea.value.trim()
    ArticleStore.saveSchedule(text).then(() => {
      alert('Sparat.')
    }, () => {
      alert('Det gick inte att spara.')
    })
  }

  render() {
    const { schedule } = this.state || {}
    return (
      <div>
        <h3>Tablå</h3>
        Här kan <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">markdown</a> användas.
        {!schedule && <textarea disabled />}
        {schedule && <textarea ref="textarea" defaultValue={schedule.text} />}
        <button onClick={this.save.bind(this)}>Spara</button>
      </div>
    )
  }
}

module.exports = ManageSchedule