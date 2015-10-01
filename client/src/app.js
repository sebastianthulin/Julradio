require('./services/LiveReload')
const React = require('react')
const Router = require('react-router')
const { Route, DefaultRoute } = Router

// Site base components
const Header = require('./components/base/Header')
const OnAir = require('./components/base/OnAir')
const Footer = require('./components/base/Footer')
const ModalContainer = require('./components/base/ModalContainer')

// Views
const Front = require('./components/views/Front')
const Admin = require('./components/views/Admin')
const UserProfile = require('./components/views/UserProfile')
const Messages = require('./components/views/Messages')

class App extends React.Component {
  render() {
    return (
      <div id="app">
        <Header />
        <OnAir />
        <Router.RouteHandler />
        <Footer />
        <ModalContainer />
      </div>
    )
  }
}

const routes = (
  <Route handler={App}>
    <Route path="/messages/:username" handler={Messages} />
    <Route path="/user/:username" handler={UserProfile} />
    <Route path="/admin/:panel" handler={Admin} />
    <Route path="/admin/:panel/:value" handler={Admin} />
    <DefaultRoute handler={Front} />
  </Route>
)

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler />, document.body)
})