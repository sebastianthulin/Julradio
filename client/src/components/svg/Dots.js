const React = require('react')

const Dots = props => (
  <svg width="160px" height="40px" viewBox="0 0 160 40" {...props}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <circle fill="#FFF" cx="20" cy="20" r="20" />
      <circle fill="#FFF" cx="80" cy="20" r="20" />
      <circle fill="#FFF" cx="140" cy="20" r="20" />
    </g>
  </svg>
)

module.exports = Dots