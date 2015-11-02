const React = require('react')
const ReservationStore = require('../../../stores/ReservationStore')

class ManageSchedule extends React.Component {
  componentWillMount() {
    // ReservationStore.get ...
  }

  render() {
    return (
      <div>
        <h3>Bokningar</h3>
      </div>
    )
  }
}

module.exports = ManageSchedule