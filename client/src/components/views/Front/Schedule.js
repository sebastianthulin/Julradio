const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const cx = require('classnames')
const dateFormat = require('dateformat')

const isThisIt = (today, daysFromToday, candiDate) => {
  today = new Date(today)
  today.setDate(today.getDate() + daysFromToday)
  return candiDate.getDate() === today.getDate()
}

const Reservation = ({reservation}) => (
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

@connect(state => ({
  reservations: state.reservations.get('items')
}))
class Schedule extends React.Component {
  render() {
    const {reservations} = this.props
    const {expanded} = this.state || {}

    const now = new Date(Date.now() + window.__TIMEDIFFERENCE__)

    const createDay = (name, daysFromToday) => {
      const res = reservations.filter(r => isThisIt(now, daysFromToday, r.get('startDate')))
      return res.size && (
        <section key={name}>
          <header>{name}</header>
          {res.map(r => <Reservation key={r.get('_id')} reservation={r} />)}
        </section>
      )
    }

    const dom = [
      createDay('Idag', 0),
      createDay('Imorgon', 1),
      createDay('Övermorgon', 2)
    ].filter(d => d)

    const upcomingDaysCount = dom.length

    return upcomingDaysCount === 0 ? null : (
      <div id="Schedule" className={cx({expanded})}>
        {dom}
        {!expanded && upcomingDaysCount > 1 && (
          <footer>
            <span onClick={() => this.setState({expanded: true})}>Visa mer...</span>
          </footer>
        )}
      </div>
    )
  }
}

module.exports = Schedule
