const React = require('react')

const Schedule = schedule => (
  <div id="Schedule">
    <header>Tablå</header>
    <div dangerouslySetInnerHTML={{__html: schedule.marked}} />
  </div>
)

module.exports = Schedule