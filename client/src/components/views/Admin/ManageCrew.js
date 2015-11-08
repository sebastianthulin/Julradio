const React = require('react')
const { Link } = require('react-router')
const UserStore = require('../../../stores/UserStore')

class ManageCrew extends React.Component {
  componentWillMount() {
    UserStore.getCrew(crew => this.setState({ crew }))
  }

  // To move the position of an element in an array:
  // #array.splice(newIndex, 0, #array.splice(oldIndex, 1)[0])
  moveUp(user) {
    const { crew } = this.state
    const index = crew.indexOf(user)
    if (index > 0) {
      crew.splice(index - 1, 0, crew.splice(index, 1)[0])
      this.setState({ crew })
    }
  }

  moveDown(user) {
    const { crew } = this.state
    const index = crew.indexOf(user)
    crew.splice(index + 1, 0, crew.splice(index, 1)[0])
    this.setState({ crew })
  }

  remove(user) {
    const { crew } = this.state
    crew.splice(crew.indexOf(user), 1)
    this.setState({ crew })
  }

  addCrewMember(ev) {
    ev.preventDefault()
    const username = this.refs.input.value.trim()
    if (!username) return
    UserStore.getByUsername(username, user => {
      const { crew } = this.state
      const conflict = crew.filter(member => user && user._id === member._id)[0]
      if (!user || conflict) {
        return alert(`Kunde inte lägga till "${username}"`)
      }
      crew.push(user)
      this.refs.input.value = ''
      this.setState({ crew })
    })
  }

  save() {
    const userIds = this.state.crew.map(user => user._id)
    UserStore.updateCrew(userIds).then(() => {
      alert('Done.')
    }).catch(() => {
      alert('Kunde inte spara.')
    })
  }

  renderUser(user) {
    return (
      <tr key={user._id}>
        <td><Link to={`/@${user.username}`}>{user.username}</Link></td>
        <td><button onClick={this.moveUp.bind(this, user)}>Flytta upp</button></td>
        <td><button onClick={this.moveDown.bind(this, user)}>Flytta ner</button></td>
        <td><button onClick={this.remove.bind(this, user)}>Ta bort</button></td>
      </tr>
    )
  }

  render() {
    const { crew } = this.state || {}
    return (
      <div>
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
          <input type="text" ref="input" placeholder="Lägg till (skriv in användarnamn)" />
        </form>
        {!crew && 'Vänta...'}
        <br />
        <button className="btn" onClick={this.save.bind(this)}>Spara</button>
      </div>
    )
  }
}

module.exports = ManageCrew