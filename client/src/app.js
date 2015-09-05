require('./services/LiveReload')
var React = require('react')
var Router = require('react-router')
var { Route, DefaultRoute } = Router

// Site base components
var Header = require('./components/base/Header')
var OnAir = require('./components/base/OnAir')
var Menu = require('./components/base/Menu')
var ModalContainer = require('./components/base/ModalContainer')
var Snowfall = require('./components/base/Snowfall')

// Views
var Front = require('./components/views/Front')
var Wish = require('./components/views/Wish')

class App extends React.Component {
  render() {
    return (
      <div id="app">
        <Header />
        <OnAir />
        <Router.RouteHandler />
        <ModalContainer />
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
    <Route path="/wish" handler={Wish} />
    <DefaultRoute handler={Front} />
  </Route>
)

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler />, document.body)
})