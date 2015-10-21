require('./services/LiveReload')
const React = require('react')
const ReactDOM = require('react-dom')
const { Router, Route, IndexRoute } = require('react-router')
const createBrowserHistory = require('history/lib/createBrowserHistory')
const marked = require('marked')
const cx = require('classnames')
const User = require('./services/User')
const UIStore = require('./stores/UIStore')

// Site base components
const Sidebar = require('./components/base/Sidebar')
const MobileHeader = require('./components/base/MobileHeader')
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
const ManageRequests = require('./components/views/Admin/ManageRequests')

// Config
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: true
})

class App extends React.Component {
  componentWillMount() {
    UIStore.subscribe(this.handleUI.bind(this))
  }

  handleUI(UI) {
    this.setState({ UI })
    const { SIDEBAR_OPEN } = UI
    document.body.classList[SIDEBAR_OPEN ? 'add' : 'remove']('no-scroll')
  }

  closeSidebar() {
    if (this.state.UI.SIDEBAR_OPEN) {
      UIStore.close('SIDEBAR_OPEN')
    }
  }

  render() {
    const { SIDEBAR_OPEN } = this.state.UI
    return (
      <div id="app" className={cx({'sidebar-visible': SIDEBAR_OPEN})}>
        <MobileHeader />
        <Sidebar />
        <div id="site" onClick={this.closeSidebar.bind(this)}>
          {this.props.children}
        </div>
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
      <Route path="articles(/:id)" component={ManageArticles} />
      <Route path="users(/:username)" component={ManageUsers} />
      <Route path="schedule" component={ManageSchedule} />
      <Route path="crew" component={ManageCrew} />
      <Route path="requests" component={ManageRequests} />
    </Route>
  </Route>
)

ReactDOM.render(
  <Router routes={routes} history={history} />,
  document.getElementById('root')
)