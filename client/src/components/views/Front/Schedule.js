const React = require('react')
const { connect } = require('react-redux')
const { Link } = require('react-router')
const cx = require('classnames')
const dateFormat = require('dateformat')

const Reservation = ({ reservation }) => (
  <div className="Reservation">
    <div className="user">
      <Link to={`/@${reservation.getIn(['user', 'username'])}`}>
        {reservation.getIn(['user', 'name'])}
      </Link>
    </div>
    <div className="description">
      {reservation.get('description')}
    </div>
    <div className="time">
      {dateFormat(reservation.get('startDate'), 'HH:MM') + ' - ' + dateFormat(reservation.get('endDate'), 'HH:MM')}
    </div>
  </div>
)

class Schedule extends React.Component {
  render() {
    const { reservations } = this.props
    const { expanded } = this.state || {}
    const fn = r => <Reservation key={r.get('_id')} reservation={r} />
    const date = new Date(Date.now() + window.__TIMEDIFFERENCE__).getDate()
    const f = reservations.filter.bind(reservations)
    const today = f(r => r.get('startDate').getDate() === date).map(fn)
    const tomorrow = f(r => r.get('startDate').getDate() === date + 1).map(fn)
    const dayAfterTomorrow = f(r => r.get('startDate').getDate() === date + 2).map(fn)

    let upcomingDaysCount = 0
    today.size > 0 && upcomingDaysCount++
    tomorrow.size > 0 && upcomingDaysCount++
    dayAfterTomorrow.size > 0 && upcomingDaysCount++

    return upcomingDaysCount === 0 ? null : (
      <div id="Schedule" className={cx({ expanded })}>
        {today.size > 0 && (
          <section>
            <header>Idag</header>
            {today.toArray()}
          </section>
        )}
        {tomorrow.size > 0 && (
          <section>
            <header>Imorgon</header>
            {tomorrow.toArray()}
          </section>
        )}
        {dayAfterTomorrow.size > 0 && (
          <section>
            <header>Övermorgon</header>
            {dayAfterTomorrow.toArray()}
          </section>
        )}
        {!expanded && upcomingDaysCount > 1 && <footer>
          <span onClick={() => this.setState({expanded: true})}>Visa mer...</span>
        </footer>}
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    reservations: state.reservations.get('items')
  })
)(Schedule)