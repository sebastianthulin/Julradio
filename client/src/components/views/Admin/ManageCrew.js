const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const {fetchCrew, updateCrew, getUserByUsername} = require('../../../actions/users')

@connect(null, {
  onFetchCrew: fetchCrew,
  onUpdateCrew: updateCrew,
  getUserByUsername
})
class ManageCrew extends React.Component {
  componentWillMount() {
    this.props.onFetchCrew().then(crew => {
      this.setState({crew})
    })
  }

  // To move the position of an element in an array:
  // #array.splice(newIndex, 0, #array.splice(oldIndex, 1)[0])
  moveUp(user) {
    const {crew} = this.state
    const index = crew.indexOf(user)
    if (index > 0) {
      crew.splice(index - 1, 0, crew.splice(index, 1)[0])
      this.setState({crew})
    }
  }

  moveDown(user) {
    const {crew} = this.state
    const index = crew.indexOf(user)
    crew.splice(index + 1, 0, crew.splice(index, 1)[0])
    this.setState({crew})
  }

  remove(user) {
    const {crew} = this.state
    crew.splice(crew.indexOf(user), 1)
    this.setState({crew})
  }

  addCrewMember(ev) {
    ev.preventDefault()
    const username = this.refs.input.value.trim()
    if (!username) return
    this.props.getUserByUsername(username).then(user => {
      const {crew} = this.state
      const conflict = crew.filter(member => user && user._id === member._id)[0]
      if (!user || conflict) {
        return alert(`Hittade inte ${username}`)
      }
      crew.push(user)
      this.refs.input.value = ''
      this.setState({crew})
    })
  }

  save() {
    const userIds = this.state.crew.map(user => user._id)
    this.props.onUpdateCrew(userIds).then(err => {
      !err && alert('Done.')
    })
  }

  renderUser(user) {
    return (
      <tr key={user._id}>
        <td><Link to={`/@${user.username}`}>{user.username}</Link></td>
        <td><button className="btn" onClick={this.moveUp.bind(this, user)}>Flytta upp</button></td>
        <td><button className="btn" onClick={this.moveDown.bind(this, user)}>Flytta ner</button></td>
        <td><button className="btn" onClick={this.remove.bind(this, user)}>Ta bort</button></td>
      </tr>
    )
  }

  render() {
    const {crew} = this.state || {}
    return (
      <div id="ManageCrew">
        <h3>Medarbetare</h3>
        <table>
          <tbody>
            <tr>
              <th>Användarnamn</th>
            </tr>
            {crew && crew.map(this.renderUser.bind(this))}
          </tbody>
        </table>
        <form onSubmit={this.addCrewMember.bind(this)}>
          <input style={{width: '470px'}} type="text" ref="input" placeholder="Lägg till (skriv in användarnamn, klicka enter)" />
        </form>
        {!crew && 'Vänta...'}
        <br />
        <button className="btn" onClick={this.save.bind(this)}>Spara</button>
      </div>
    )
  }
}

module.exports = ManageCrew
