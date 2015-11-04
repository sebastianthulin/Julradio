const React = require('react')
const ReservationStore = require('../../../stores/ReservationStore')

const Reservation = ({ startDate, endDate, description }) => (
  <div className="Reservation">
    <span>{startDate + ' - ' + endDate}</span>
    <p>{description}</p>
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
        <h3>Tablå</h3>
        {reservations.map(reservation => <Reservation key={reservation._id} {...reservation} />)}
      </div>
    ) : (
      <div className="somethingcool">

      </div>
    )
  }
}

module.exports = Schedule