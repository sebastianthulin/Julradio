const React = require('react')
const { Link } = require('react-router')
const dateFormat = require('dateformat')
const ReservationStore = require('../../../stores/ReservationStore')

const Reservation = ({ startDate, endDate, description, user }) => (
  <div className="Reservation">
    <div className="user"><Link to={`/@${user.username}`}>{user.name}</Link></div>
    <div className="description">{description}</div>
    <div className="time">{`${dateFormat(startDate, 'HH:MM')} - ${dateFormat(endDate, 'HH:MM')}`}</div>
  </div>
)

class Schedule extends React.Component {
  componentWillMount() {
    this.unsubscribe = ReservationStore.subscribe('reservations', reservations => this.setState({ reservations }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { reservations } = this.state || {}
    const fn = r => <Reservation key={r._id} {...r} />
    const today = (reservations || []).filter(r => r.today).map(fn)
    const tomorrow = (reservations || []).filter(r => r.tomorrow).map(fn)

    return reservations && reservations.length > 0 ? (
      <div id="Schedule">
        {today.length > 0 && (
          <section className="fst">
            <header>Idag</header>
            {today}
          </section>
        )}
        {tomorrow.length > 0 && (
          <section className="snd">
            <header>Imorgon</header>
            {tomorrow}
          </section>
        )}
      </div>
    ) : (
      <div className="somethingcool">

      </div>
    )
  }
}

module.exports = Schedule