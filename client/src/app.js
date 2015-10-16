require('./services/LiveReload')
const React = require('react')
const ReactDOM = require('react-dom')
const { Router, Route, IndexRoute } = require('react-router')
const createBrowserHistory = require('history/lib/createBrowserHistory')
const marked = require('marked')
const User = require('./services/User')

// Config
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: true
})

// Site base components
const Header = require('./components/base/Header')
const OnAir = require('./components/base/OnAir')
const Footer = require('./components/base/Footer')
const ModalContainer = require('./components/base/ModalContainer')

// Views
const Front = require('./components/views/Front')
const UserProfile = require('./components/views/UserProfile')
const Settings = require('./components/views/Settings')
const Messages = require('./components/views/Messages')
const Crew = require('./components/views/Crew')
const Admin = require('./components/views/Admin')
const ManageArticles = require('./components/views/Admin/ManageArticles')
const ManageUsers = require('./components/views/Admin/ManageUsers')
const ManageSchedule = require('./components/views/Admin/ManageSchedule')
const ManageCrew = require('./components/views/Admin/ManageCrew')

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

function requireAuth(nextState, replaceState) {
  if (!User.get()) {
    replaceState({nextPathname: nextState.location.pathname}, '/')
  }
}

function requireAdminAuth(nextState, replaceState) {
  if (!(User.get() || {}).admin) {
    replaceState({nextPathname: nextState.location.pathname}, '/')
  }
}

const history = createBrowserHistory()
const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Front} />
    <Route path="crew" component={Crew} />
    <Route path="messages" component={Messages} onEnter={requireAuth} />
    <Route path="messages/:user" component={Messages} onEnter={requireAuth} />
    <Route path="@:username" component={UserProfile} />
    <Route path="settings" component={Settings} onEnter={requireAuth} />
    <Route path="admin" component={Admin} onEnter={requireAdminAuth}>
      <Route path="articles" component={ManageArticles} />
      <Route path="articles/:id" component={ManageArticles} />
      <Route path="users" component={ManageUsers} />
      <Route path="users/:username" component={ManageUsers} />
      <Route path="schedule" component={ManageSchedule} />
      <Route path="crew" component={ManageCrew} />
    </Route>
  </Route>
)

ReactDOM.render(
  <Router children={routes} history={history} />,
  document.getElementById('app')
)