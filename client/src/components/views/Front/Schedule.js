const React = require('react')

const Schedule = schedule => (
  <div className="content schedule">
    <header>Tablå</header>
    <div dangerouslySetInnerHTML={{__html: schedule.marked}} />
  </div>
)

module.exports = Schedule