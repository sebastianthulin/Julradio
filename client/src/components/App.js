const React = require('react')
const cx = require('classnames')
const UIStore = require('../stores/UIStore')

// Site base components
const Sidebar = require('./base/Sidebar')
const MobileHeader = require('./base/MobileHeader')
const ModalContainer = require('./base/ModalContainer')
const NotificationContainer = require('./base/NotificationContainer')

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

module.exports = App