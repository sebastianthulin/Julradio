var React = require('react')
var Navigation = require('./Navigation')

var panels = {
  articles: require('./ManageArticles')
}

class Admin extends React.Component {
  componentWillMount() {
    this.setPanel()
  }

  componentWillReceiveProps() {
    this.setPanel()
  }

  setPanel() {
    var params = this.context.router.getCurrentParams()
    this.setState({
      Panel: panels[params.panel],
      param: params.value
    })
  }

  render() {
    var { Panel, param } = this.state
    return (
      <div id="admin" className="row content">
        <Navigation />
        {Panel && <Panel param={param} />}
      </div>
    )
  }
}

Admin.contextTypes = {
  router: React.PropTypes.func
}

module.exports = Admin