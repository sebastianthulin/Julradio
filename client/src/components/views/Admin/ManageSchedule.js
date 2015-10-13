const React = require('react')
const ArticleStore = require('../../../stores/ArticleStore')

class ManageSchedule extends React.Component {
  componentWillMount() {
    ArticleStore.getSchedule(schedule => this.setState({ schedule }))
  }

  save() {
    var text = this.refs.textarea.value.trim()
    ArticleStore.saveSchedule(text).then(() => {
      alert('Sparat.')
    }, () => {
      alert('Det gick inte att spara.')
    })
  }

  render() {
    const { schedule } = this.state || {}
    return (
      <div className="ten columns">
        <h3>Tablå</h3>
        {schedule && <textarea ref="textarea" defaultValue={schedule.text} />}
        <button onClick={this.save.bind(this)}>Spara</button>
      </div>
    )
  }
}

module.exports = ManageSchedule