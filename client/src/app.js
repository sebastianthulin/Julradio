require('./services/LiveReload')
var React = require('react')
var Router = require('react-router')
var { Route, DefaultRoute } = Router

// Site base components
var Header = require('./components/base/Header')
var HeaderV2 = require('./components/base/HeaderV2')
var OnAir = require('./components/base/OnAir')
var ModalContainer = require('./components/base/ModalContainer')
var Snowfall = require('./components/base/Snowfall')

// Views
var Front = require('./components/views/Front')
var History = require('./components/views/History')
var Admin = require('./components/views/Admin')

class App extends React.Component {
  render() {
    return (
      <div id="app">
        <Header />
        <OnAir />
        <Router.RouteHandler />
        <div className="footer">
          <span className="footerLogo">Julradio</span>
          <div className="fRow"><div className="fRowOne">Ansvarig</div><div className="fRowTwo">boss@julradio.se</div></div>
          <div className="fRow"><div className="fRowOne">Inqueries</div><div className="fRowTwo">business@julradio.se</div></div>
          <div className="fRow"><div className="fRowOne">Stuff</div><div className="fRowTwo">help@julradio.se</div></div>
        </div>
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
    <Route path="/historik" handler={History} />
    <Route path="/admin/:panel" handler={Admin} />
    <Route path="/admin/:panel/:value" handler={Admin} />
    <DefaultRoute handler={Front} />
  </Route>
)

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler />, document.body)
})