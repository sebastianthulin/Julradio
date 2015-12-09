const React = require('react')
const { Link } = require('react-router')
const cx = require('classnames')
const dateFormat = require('dateformat')
const ReservationStore = require('../../../stores/ReservationStore')

const Reservation = ({ startDate, endDate, description, user }) => (
  <div className="Reservation">
    <div className="user"><Link to={`/@${user.username}`}>{user.name}</Link></div>
    <div className="description">{description}</div>
    <div className="time">
      {dateFormat(startDate, 'HH:MM') + ' - ' + dateFormat(endDate, 'HH:MM')}
    </div>
  </div>
)

class Schedule extends React.Component {
  componentWillMount() {
    this.unsubscribe = ReservationStore.subscribe('reservations', reservations => this.setState({ reservations }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  expand() {
    this.setState({expanded: true})
  }

  render() {
    const { reservations, expanded } = this.state
    const fn = r => <Reservation key={r._id} {...r} />
    const date = new Date(Date.now() + window.__TIMEDIFFERENCE__).getDate()
    const today = reservations.filter(r => r.startDate.getDate() === date).map(fn)
    const tomorrow = reservations.filter(r => r.startDate.getDate() === date + 1).map(fn)
    const dayAfterTomorrow = reservations.filter(r => r.startDate.getDate() === date + 2).map(fn)

    let upcomingDaysCount = 0
    today.length > 0 && upcomingDaysCount++
    tomorrow.length > 0 && upcomingDaysCount++
    dayAfterTomorrow.length > 0 && upcomingDaysCount++

    return upcomingDaysCount === 0 ? null : (
      <div id="Schedule" className={cx({ expanded })}>
        {today.length > 0 && (
          <section>
            <header>Idag</header>
            {today}
          </section>
        )}
        {tomorrow.length > 0 && (
          <section>
            <header>Imorgon</header>
            {tomorrow}
          </section>
        )}
        {dayAfterTomorrow.length > 0 && (
          <section>
            <header>Övermorgon</header>
            {dayAfterTomorrow}
          </section>
        )}
        {!expanded && upcomingDaysCount > 1 && <footer>
          <span onClick={this.expand.bind(this)}>Visa mer...</span>
        </footer>}
      </div>
    )
  }
}

module.exports = Schedule