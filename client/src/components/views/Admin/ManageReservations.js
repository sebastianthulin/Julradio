const React = require('react')
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
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  save() {
    const opts = {
      description: this.refs.text.value,
      startDate: Date.now(),
      endDate: Date.now() + 5000
    }

    if (!opts.description || !opts.startDate || !opts.endDate) {
      return alert('Fyll i alla fält')
    }

    ReservationStore.create(opts).then(() => {
      this.refs.text.value = ''
    })
  }

  render() {
    const reservations = this.state.reservations || []
    return (
      <div>
        <h3>Bokningar</h3>
        <div className="row">
          <div className="oneHalf column">
            <input type="text" ref="text" placeholder="Text" />
            <button onClick={this.save.bind(this)}>Lägg till</button>
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