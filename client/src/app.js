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
          <div className="section">
            <div className="fRow"><div className="fRowOne">Ansvarig</div><div className="fRowTwo">boss@julradio.se</div></div>
            <div className="fRow"><div className="fRowOne">Radioansvarig</div><div className="fRowTwo">johan.gardemark@julradio.se</div></div>
            <div className="fRow"><div className="fRowOne">Webansvarig</div><div className="fRowTwo">web@julradio.se</div></div>
            <div className="fRow"><div className="fRowOne">Sponsor</div><div className="fRowTwo">sponsor@julradio.se</div></div>
            <div className="fRow"><div className="fRowOne">Sponsor</div><div className="fRowTwo">sponsor@julradio.se</div></div>
          </div>
          <div className="section">
            <div className="fRow"><div className="fRowOne">Radiopratare</div></div>
            <div className="fRow"><div className="fRowTwo">Thobias Bengtsson</div></div>
            <div className="fRow"><div className="fRowTwo">Ola Sterling</div></div>
            <div className="fRow"><div className="fRowTwo">Johan Abrahamsson</div></div>
            <div className="fRow"><div className="fRowTwo">Linus Nygren</div></div>
          </div>
          <div className="section">
            <div className="fRow"><div className="fRowOne">Radiopratare</div></div>
            <div className="fRow"><div className="fRowTwo">Pierre Andersson</div></div>
            <div className="fRow"><div className="fRowTwo">Joachim Kählman</div></div>
            <div className="fRow"><div className="fRowTwo">Alexander Jungå</div></div>
            <div className="fRow"><div className="fRowTwo">John Claesson</div></div>
          </div>
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