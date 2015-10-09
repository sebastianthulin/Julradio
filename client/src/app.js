require('./services/LiveReload')
const React = require('react')
const ReactDOM = require('react-dom')
const { Router, Route, IndexRoute } = require('react-router')
const history = require('react-router/node_modules/history/lib/createBrowserHistory')()

// Site base components
const Header = require('./components/base/Header')
const OnAir = require('./components/base/OnAir')
const Footer = require('./components/base/Footer')
const ModalContainer = require('./components/base/ModalContainer')

// Views
const Front = require('./components/views/Front')
const UserProfile = require('./components/views/UserProfile')
const Messages = require('./components/views/Messages')
const Admin = require('./components/views/Admin')
const ManageArticles = require('./components/views/Admin/ManageArticles')

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <OnAir />
        {this.props.children}
        <Footer />
        <ModalContainer />
      </div>
    )
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Front} />
    <Route path="medarbetare" component={Staff} />
    <Route path="messages" component={Messages} />
    <Route path="messages/:chatId" component={Messages} />
    <Route path="@:username" component={UserProfile} />
    <Route path="admin" component={Admin}>
      <Route path="articles" component={ManageArticles} />
      <Route path="articles/:id" component={ManageArticles} />
    </Route>
  </Route>
)

ReactDOM.render(
  <Router children={routes} history={history} />,
  document.getElementById('app')
)