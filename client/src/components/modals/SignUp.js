var React = require('react')
var UserStore = require('../../stores/UserStore')

class SignUp extends React.Component {
  serialize() {
    var data = {}
    var inputs = this.refs.form.getDOMNode().elements
    for(var i = 0; i < inputs.length; i++) {
      var input = inputs[i]
      if (input.name)
        data[input.name] = input.value
    }
    return data
  }

  submit(e) {
    e.preventDefault()
    var data = this.serialize()
    UserStore.signUp(data, function(err, user) {
      // Do stuff
    })
  }

  render() {
    return (
      <div className="modal">
        <header>
          Registrera dig
        </header>
        <main>
          <form ref="form" onSubmit={this.submit.bind(this)}>
            <input name="username" type="text" placeholder="Användarnamn"/>
            <input name="email" type="email" placeholder="Email"/>
            <input name="password" type="password" placeholder="Lösenord"/>
            <div className="submit">
              <button>Registrera dig</button>
            </div>
          </form>
        </main>
      </div>
    )
  }
}

module.exports = SignUp