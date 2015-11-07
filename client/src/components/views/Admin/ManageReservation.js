const React = require('react')
const dateFormat = require('dateformat')
const ReservationStore = require('../../../stores/ReservationStore')

class ManageReservation extends React.Component {
  componentWillMount() {
    const r = this.props.reservation

    this.days = []
    for (let i = 0; i < 7; i++) {
      const time = Date.now() + window.__TIMEDIFFERENCE__ + i * 24 * 60 * 60 * 1000
      this.days.push(time)
    }

    this.defaultVal = r ? {
      description: r.description,
      startTime: dateFormat(r.startDate, 'HH:MM'),
      endTime: dateFormat(r.endDate, 'HH:MM'),
      date: (() => {
        const date = r.startDate.getDate()
        let i = this.days.length
        while (i--) {
          if (date === new Date(this.days[i]).getDate()) {
            return this.days[i]
          }
        }
      })()
    } : {}
  }

  getId() {
    return (this.props.reservation || {})._id
  }

  save() {
    const id = this.getId()
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

    if (id) {
      ReservationStore.update(id, opts).then(() => {
        alert('ändringar sparade.')
      }).catch(this.handleErr.bind(this))
    } else {
      ReservationStore.create(opts).then(() => {
        this.refs.startTime.value = ''
        this.refs.endTime.value = ''
        this.refs.text.value = ''
        alert('done.')
      }).catch(this.handleErr.bind(this))
    }
  }

  delete() {
    const id = this.getId()
    if (confirm('Säkert?')) {
      ReservationStore.delete(id).then(() => {
        this.props.deselect()
      }).catch(this.handleErr.bind(this))
    }
  }

  handleErr(err) {
    alert(err.response.body.err)
  }

  render() {
    const isNew = !this.getId()
    return (
      <div>
        <label className="setting">
          <div className="label">Dag</div>
          <select ref="date" defaultValue={this.defaultVal.date}>
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
            ref="startTime"
            placeholder="exempelvis 10:00"
            defaultValue={this.defaultVal.startTime}
          />
        </label>
        <label className="setting">
          <div className="label">Slut tid</div>
          <input
            type="text"
            ref="endTime"
            placeholder="exempelvis 13:30"
            defaultValue={this.defaultVal.endTime}
          />
        </label>
        <label className="setting">
          <div className="label">Text</div>
          <input
            type="text"
            ref="text"
            defaultValue={this.defaultVal.description}
          />
        </label>
        <button className="btn" style={{float: 'right'}} onClick={this.save.bind(this)}>
          {isNew ? 'Skapa' : 'Spara ändringar'}
        </button>
        {!isNew && <button className="btn" style={{float: 'right', marginRight: 10}} onClick={this.delete.bind(this)}>Ta bort</button>}
      </div>
    )
  }
}

module.exports = ManageReservation