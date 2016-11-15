const React = require('react')
const {Route, IndexRoute} = require('react-router')
const User = require('./services/User')

// Views
const App = require('./components/App')
const Front = require('./components/views/Front')
const ArticleView = require('./components/views/ArticleView')
const ArticleArchive = require('./components/views/ArticleArchive')
const ResetPassword = require('./components/views/ResetPassword')
const UserProfile = require('./components/views/UserProfile')
const Settings = require('./components/views/Settings')
const Messages = require('./components/views/Messages')
const CosyCorner = require('./components/views/CosyCorner')
const FindUsers = require('./components/views/FindUsers')
const Crew = require('./components/views/Crew')
const History = require('./components/views/History')
const Admin = require('./components/views/Admin')
const ManageArticles = require('./components/views/Admin/ManageArticles')
const ManageUsers = require('./components/views/Admin/ManageUsers')
const ManageReservations = require('./components/views/Admin/ManageReservations')
const ManageCrew = require('./components/views/Admin/ManageCrew')
const ManageRequests = require('./components/views/Admin/ManageRequests')
const NotFound = require('./components/views/NotFound')

const requireAuth = (nextState, replaceState) => {
  if (!User.get()) {
    replaceState({nextPathname: nextState.location.pathname}, '/')
  }
}

const requireAdminAuth = (nextState, replaceState) => {
  if (!User.isAnything()) {
    replaceState({nextPathname: nextState.location.pathname}, '/')
  }
}

const routes = (
  <Route component={App}>
    <Route path="/" component={Front} />
    <Route path="/article/:id" component={ArticleView} />
    <Route path="/archive" component={ArticleArchive} />
    <Route path="/forgot/:id" component={ResetPassword} />
    <Route path="/crew" component={Crew} />
    <Route path="/history" component={History} />
    <Route path="/messages(/:user)" component={Messages} onEnter={requireAuth} />
    <Route path="/cosycorner" component={CosyCorner} />
    <Route path="/findusers" component={FindUsers} />
    <Route path="/@:username" component={UserProfile} />
    <Route path="/settings" component={Settings} onEnter={requireAuth} />
    <Route path="/admin" component={Admin} onEnter={requireAdminAuth}>
      <Route path="articles(/:id)" component={ManageArticles} />
      <Route path="users(/:username)" component={ManageUsers} />
      <Route path="reservations" component={ManageReservations} />
      <Route path="crew" component={ManageCrew} />
      <Route path="requests" component={ManageRequests} />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
)

module.exports = routes
