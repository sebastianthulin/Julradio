require('./services/LiveReload')
const React = require('react')
const ReactDOM = require('react-dom')
const { Router, Route, IndexRoute } = require('react-router')
const marked = require('marked')
const cx = require('classnames')
const User = require('./services/User')
const UIStore = require('./stores/UIStore')
const history = require('./services/history')

// Site base components
const Sidebar = require('./components/base/Sidebar')
const MobileHeader = require('./components/base/MobileHeader')
const ModalContainer = require('./components/base/ModalContainer')
const NotificationContainer = require('./components/base/NotificationContainer')

// Views
const Front = require('./components/views/Front')
const ArticleView = require('./components/views/ArticleView')
const ArticleArchive = require('./components/views/ArticleArchive')
const ResetPassword = require('./components/views/ResetPassword')
const UserProfile = require('./components/views/UserProfile')
const Settings = require('./components/views/Settings')
const Messages = require('./components/views/Messages')
const CosyCorner = require('./components/views/CosyCorner')
const Crew = require('./components/views/Crew')
const History = require('./components/views/History')
const Admin = require('./components/views/Admin')
const ManageArticles = require('./components/views/Admin/ManageArticles')
const ManageUsers = require('./components/views/Admin/ManageUsers')
const ManageReservations = require('./components/views/Admin/ManageReservations')
const ManageCrew = require('./components/views/Admin/ManageCrew')
const ManageRequests = require('./components/views/Admin/ManageRequests')
const NotFound = require('./components/views/NotFound')

// Config
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: true
})

class App extends React.Component {
  componentWillMount() {
    UIStore.subscribe(UI => this.setState({ UI }))
  }

  componentWillReceiveProps() {
    UIStore.close('SIDEBAR_OPEN')
  }

  closeSidebar() {
    if (this.state.UI.SIDEBAR_OPEN) {
      UIStore.close('SIDEBAR_OPEN')
    }
  }

  render() {
    const { SIDEBAR_OPEN } = this.state.UI
    return (
      <div id="App" className={cx({sidebarVisible: SIDEBAR_OPEN})}>
        <MobileHeader />
        <Sidebar />
        <div id="site" onClick={this.closeSidebar.bind(this)}>
          {this.props.children}
        </div>
        <ModalContainer />
        <NotificationContainer />
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
  if (!User.isAnything()) {
    replaceState({nextPathname: nextState.location.pathname}, '/')
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Front} />
    <Route path="article/:id" component={ArticleView} />
    <Route path="archive" component={ArticleArchive} />
    <Route path="forgot/:id" component={ResetPassword} />
    <Route path="crew" component={Crew} />
    <Route path="history" component={History} />
    <Route path="messages(/:user)" component={Messages} onEnter={requireAuth} />
    <Route path="cosycorner" component={CosyCorner} />
    <Route path="@:username" component={UserProfile} />
    <Route path="settings" component={Settings} onEnter={requireAuth} />
    <Route path="admin" component={Admin} onEnter={requireAdminAuth}>
      <Route path="articles(/:id)" component={ManageArticles} />
      <Route path="users(/:username)" component={ManageUsers} />
      <Route path="reservations" component={ManageReservations} />
      <Route path="crew" component={ManageCrew} />
      <Route path="requests" component={ManageRequests} />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
)

ReactDOM.render(
  <Router routes={routes} history={history} />,
  document.getElementById('root')
)