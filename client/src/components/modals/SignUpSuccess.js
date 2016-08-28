const React = require('react')
const Modal = require('./Modal')

class SignUpSuccess extends React.Component {
  render() {
    return (
      <Modal className="SignUpSuccess">
        <header>
          Välkommen till Julradio!
        </header>
        <main>
          <p>Gå in på din mail och verifiera kontot för att logga in.</p>
        </main>
      </Modal>
    )
  }
}

module.exports = SignUpSuccess
