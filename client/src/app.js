require('./services/LiveReload')
var React = require('react')
var Router = require('react-router')
var { Route, DefaultRoute } = Router

// Site base components
var Header = require('./components/base/Header')
var OnAir = require('./components/base/OnAir')
var Menu = require('./components/base/Menu')
var Snowfall = require('./components/base/Snowfall')

// Views
var Front = require('./components/views/Front')

class App extends React.Component {
  render() {
    return (
      <div id="app">
        <Header />
        <OnAir />
        <Menu />
        <Router.RouteHandler />
        <Snowfall
          count={300}
          minSize={1}
          maxSize={2}
          minSpeed={1}
          maxSpeed={5}
        />
      </div>
    )
  }
}

const routes = (
  <Route handler={App}>
    <DefaultRoute handler={Front} />
  </Route>
)

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler />, document.body)
})