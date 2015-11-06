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
    this.unsubscribe = ReservationStore.subscribe(reservations => this.setState({ reservations }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { reservations } = this.state || {}
    return reservations ? (
      <div id="Schedule">
        <section className="fst">
          <header>Idag</header>
          {reservations.filter(r => r.today).map(r => <Reservation key={r._id} {...r} />)}
        </section>
        <section className="snd">
          <header>Imorgon</header>
          {reservations.filter(r => r.tomorrow).map(r => <Reservation key={r._id} {...r} />)}
        </section>
      </div>
    ) : (
      <div className="somethingcool">

      </div>
    )
  }
}

module.exports = Schedule