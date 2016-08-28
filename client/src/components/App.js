const React = require('react')
const {connect} = require('react-redux')
const cx = require('classnames')
const {setVisibility} = require('../actions/visibility')

// Site base components
const Sidebar = require('./base/Sidebar')
const MobileHeader = require('./base/MobileHeader')
const ModalContainer = require('./base/ModalContainer')
const NotificationContainer = require('./base/NotificationContainer')

@connect(state => ({
  sidebarVisible: state.visibility.get('sidebar') === 'SIDEBAR_OPEN'
}), {
  setVisibility
})
class App extends React.Component {
  componentWillReceiveProps(props) {
    if (this.props.location !== props.location) {
      this.props.setVisibility('sidebar', 'SIDEBAR_CLOSED')
    }
  }

  closeSidebar() {
    if (this.props.sidebarVisible) {
      this.props.setVisibility('sidebar', 'SIDEBAR_CLOSED')
    }
  }

  render() {
    const {sidebarVisible} = this.props
    return (
      <div id="App" className={cx({sidebarVisible})}>
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
