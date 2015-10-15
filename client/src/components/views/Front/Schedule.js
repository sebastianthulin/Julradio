const React = require('react')

const Schedule = schedule => (
  <div className="scheduleBox">
    <div dangerouslySetInnerHTML={{__html: schedule.marked}} />
  </div>
)

module.exports = Schedule