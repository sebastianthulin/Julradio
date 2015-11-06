const React = require('react')
const dateFormat = require('dateformat')
const ReservationStore = require('../../../stores/ReservationStore')

class Reservation extends React.Component {
  remove() {
    ReservationStore.delete(this.props._id)
  }

  render() {
    const { startDate, endDate, description } = this.props
    return (
      <div>
        {description}
        <button onClick={this.remove.bind(this)}>Ta bort</button>
      </div>
    )
  }
}

class ManageSchedule extends React.Component {
  componentWillMount() {
    this.state = {}
    this.unsubscribe = ReservationStore.subscribe(reservations => this.setState({ reservations }))
    this.days = []
    for (var i = 0; i < 7; i++) {
      const time = Date.now() + window.__TIMEDIFFERENCE__ + i * 24 * 60 * 60 * 1000
      this.days.push(time)
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  save() {
    const date = new Date(Number(this.refs.date.value))
    const opts = {
      month: date.getMonth(),
      day: date.getDate(),
      startTime: this.refs.startTime.value,
      endTime: this.refs.endTime.value,
      description: this.refs.text.value
    }

    if (!opts.description || !opts.startTime || !opts.endTime) {
      return alert('Fyll i alla fält')
    }

    ReservationStore.create(opts).then(() => {
      this.refs.text.value = ''
    }).catch(err => {
      alert(err.response.body.err)
    })
  }

  render() {
    const reservations = this.state.reservations || []
    return (
      <div>
        <h3>Bokningar</h3>
        <div className="row">
          <div className="oneHalf column">
            <label className="setting">
              <div className="label">Dag</div>
              <select ref="date">
                {this.days.map(d => <option
                  key={d}
                  value={d}
                  children={dateFormat(d, 'dddd, mmmm d')}
                />)}
              </select>
            </label>
            <label className="setting">
              <div className="label">Start tid</div>
              <input
                type="text"
                placeholder="exempelvis 10:00"
                ref="startTime"
              />
            </label>
            <label className="setting">
              <div className="label">Slut tid</div>
              <input
                type="text"
                placeholder="exempelvis 13:30"
                ref="endTime"
              />
            </label>
            <label className="setting">
              <div className="label">Text</div>
              <input
                type="text"
                ref="text"
              />
            </label>
            <button className="btn" onClick={this.save.bind(this)}>Lägg till</button>
          </div>
          <div className="oneHalf column">
            {reservations.map(r => <Reservation key={r._id} {...r} />)}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ManageSchedule