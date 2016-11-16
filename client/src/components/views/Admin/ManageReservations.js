const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const cx = require('classnames')
const dateFormat = require('dateformat')
const ManageReservation = require('./ManageReservation')
const selectors = require('../../../selectors')

const ReservationItem = ({reservation, onClick, selected}) => (
  <div className={cx('ReservationItem', {selected})} onClick={onClick}>
    <div className="timeContainer">
      <div className="time">{dateFormat(reservation.get('startDate'), 'HH:MM')}</div>
      <span>-</span>
      <div className="time">{dateFormat(reservation.get('endDate'), 'HH:MM')}</div>
    </div>
    <Link className="user" to={`/@${reservation.getIn(['user', 'username'])}`}>
      {reservation.getIn(['user', 'name'])}
    </Link>
    <div className="description">{reservation.get('description')}</div>
  </div>
)

@connect(state => ({
  userId: selectors.userId(state),
  isAdmin: selectors.isAdmin(state),
  reservations: state.reservations.get('items')
}))
class ManageReservations extends React.Component {
  componentWillMount() {
    this.handleReservations(this.props.reservations)
  }

  componentWillReceiveProps(props) {
    if (this.props.reservations !== props.reservations) {
      this.handleReservations(props.reservations)
    }
  }

  handleReservations(items) {
    this.items = items
    const dates = []
    const reservationsByDate = {}
    for (let i = 0; i < items.size; i++) {
      const res = items.get(i)
      const today = new Date(Date.now() + window.__TIMEDIFFERENCE__).getDate()
      if (res.get('startDate').getDate() >= today) {
        const date = dateFormat(res.get('startDate'), 'dddd, mmmm d')
        if (dates[dates.length - 1] !== date) {
          dates.push(date)
        }
        reservationsByDate[date] = reservationsByDate[date] || []
        reservationsByDate[date].push(res)
      }
    }
    this.setState({dates, reservationsByDate})
  }

  select(id) {
    const {userId, isAdmin} = this.props
    const prevId = this.state.selected && this.state.selected.get('_id')
    const reservation = this.items.filter(r => r.get('_id') === id).get(0)
    if (id === prevId) {
      this.deselect()
    } else {
      this.setState({
        selected: reservation,
        removable: reservation.getIn(['user', '_id']) === userId || isAdmin
      })
    }
  }

  deselect() {
    this.setState({
      selected: null,
      removable: false
    })
  }

  renderDay(date) {
    const reservations = this.state.reservationsByDate[date]
    const selectedId = this.state.selected && this.state.selected.get('_id')
    return (
      <div key={date} className="day">
        <div className="date">{date}</div>
        {reservations.map(r => <ReservationItem
          key={r.get('_id')}
          selected={r.get('_id') === selectedId}
          onClick={this.select.bind(this, r.get('_id'))}
          reservation={r}
        />)}
      </div>
    )
  }

  render() {
    const {dates, selected, removable} = this.state || {}
    return (
      <div id="ManageReservations" className="row">
        <div className="oneHalf column">
          <h3>Bokningar</h3>
          {!selected && <ManageReservation />}
          {selected && <ManageReservation
            key={selected.get('_id')}
            reservation={selected}
            deselect={this.deselect.bind(this)}
            removable={removable}
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
