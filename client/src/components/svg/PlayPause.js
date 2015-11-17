const React = require('react')

const PlayPause = props => props.pause ? (
  <svg width="12px" height="14px" viewBox="0 0 12 14" {...props}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-214.000000, -46.000000)" fill="#FFF">
        <g transform="translate(214.000000, 46.000000)">
          <path d="M0,14 L4,14 L4,0 L0,0 L0,14 L0,14 Z M8,0 L8,14 L12,14 L12,0 L8,0 L8,0 Z"></path>
        </g>
      </g>
    </g>
  </svg>
) : (
  <svg width="12px" height="14px" viewBox="0 0 12 14" {...props}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-88.000000, -88.000000)" fill="#FFF">
        <g transform="translate(88.500000, 88.000000)">
          <path d="M0,0 L0,14 L11,7 L0,0 Z"></path>
        </g>
      </g>
    </g>
  </svg>
)

module.exports = PlayPause