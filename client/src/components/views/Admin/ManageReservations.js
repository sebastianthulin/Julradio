const React = require('react')
const { Link } = require('react-router')
const cx = require('classnames')
const dateFormat = require('dateformat')
const ReservationStore = require('../../../stores/ReservationStore')
const ManageReservation = require('./ManageReservation')

const ReservationItem = ({ startDate, endDate, description, user, onClick, selected }) => (
  <div className={cx('ReservationItem', { selected })} onClick={onClick}>
    <div className="timeContainer">
      <div className="time">{dateFormat(startDate, 'HH:MM')}</div>
      <span>-</span>
      <div className="time">{dateFormat(endDate, 'HH:MM')}</div>
    </div>
    <Link className="user" to={`/@${user.username}`}>{user.name}</Link>
    <div className="description">{description}</div>
  </div>
)

class ManageReservations extends React.Component {
  componentWillMount() {
    this.unsubscribe = ReservationStore.subscribe('reservations', this.handleReservations.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleReservations(list) {
    if (!list) return
    this.list = list
    const dates = []
    const reservationsByDate = {}
    for (var i = 0; i < list.length; i++) {
      const res = list[i]
      const date = dateFormat(res.startDate, 'dddd, mmmm d')
      if (dates[dates.length - 1] !== date) {
        dates.push(date)
      }
      reservationsByDate[date] = reservationsByDate[date] || []
      reservationsByDate[date].push(res)
    }
    this.setState({ dates, reservationsByDate })
  }

  select(id) {
    const prevId = (this.state.selected || {})._id
    const reservation = this.list.filter(r => r._id === id)[0]
    if (id === prevId) {
      this.deselect()
    } else {
      this.setState({selected: reservation})
    }
  }

  deselect() {
    this.setState({selected: null})
  }

  renderDay(date) {
    const reservations = this.state.reservationsByDate[date]
    const selectedId = (this.state.selected || {})._id
    return (
      <div key={date} className="day">
        <div className="date">{date}</div>
        {reservations.map(r => <ReservationItem
          key={r._id}
          selected={r._id === selectedId}
          onClick={this.select.bind(this, r._id)}
          {...r}
        />)}
      </div>
    )
  }

  render() {
    const { dates, selected } = this.state || {}
    return (
      <div id="ManageReservations" className="row">
        <div className="oneHalf column">
          <h3>Bokningar</h3>
          {!selected && <ManageReservation />}
          {selected && <ManageReservation
            key={selected._id}
            reservation={selected}
            deselect={this.deselect.bind(this)}
          />}
        </div>
        <div className="oneHalf column reservationList">
          {dates && dates.map(this.renderDay.bind(this))}
        </div>
      </div>
    )
  }
}

module.exports = ManageReservations