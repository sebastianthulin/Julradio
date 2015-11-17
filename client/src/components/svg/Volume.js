const React = require('react')

const off = (
  <g transform="translate(-169.000000, -170.000000)" fill="#FFF">
    <g transform="translate(169.000000, 170.000000)">
      <path d="M13.5,9 C13.5,7.2 12.5,5.7 11,5 L11,7.2 L13.5,9.7 L13.5,9 L13.5,9 Z M16,9 C16,9.9 15.8,10.8 15.5,11.6 L17,13.1 C17.7,11.9 18,10.4 18,8.9 C18,4.6 15,1 11,0.1 L11,2.2 C13.9,3.2 16,5.8 16,9 L16,9 Z M1.3,0 L0,1.3 L4.7,6 L0,6 L0,12 L4,12 L9,17 L9,10.3 L13.3,14.6 C12.6,15.1 11.9,15.5 11,15.8 L11,17.9 C12.4,17.6 13.6,17 14.7,16.1 L16.7,18.1 L18,16.8 L9,7.8 L1.3,0 L1.3,0 Z M9,1 L6.9,3.1 L9,5.2 L9,1 L9,1 Z" />
    </g>
  </g>
)

const down = (
  <g transform="translate(-87.000000, -171.000000)" fill="#FFF">
    <g transform="translate(87.000000, 171.000000)">
    <path d="M13.5,8 C13.5,6.2 12.5,4.7 11,4 L11,12 C12.5,11.3 13.5,9.8 13.5,8 L13.5,8 Z M0,5 L0,11 L4,11 L9,16 L9,0 L4,5 L0,5 L0,5 Z" />
    </g>
  </g>
)

const up = (
  <g transform="translate(-211.000000, -170.000000)" fill="#FFF">
    <g transform="translate(211.000000, 170.000000)">
      <path d="M0,6 L0,12 L4,12 L9,17 L9,1 L4,6 L0,6 L0,6 Z M13.5,9 C13.5,7.2 12.5,5.7 11,5 L11,13 C12.5,12.3 13.5,10.8 13.5,9 L13.5,9 Z M11,0.2 L11,2.3 C13.9,3.2 16,5.8 16,9 C16,12.2 13.9,14.8 11,15.7 L11,17.8 C15,16.9 18,13.3 18,9 C18,4.7 15,1.1 11,0.2 L11,0.2 Z" />
    </g>
  </g>
)

const mute = (
  <g transform="translate(-131.000000, -171.000000)" fill="#FFF">
    <g transform="translate(131.500000, 171.000000)">
      <path d="M0,5 L0,11 L4,11 L9,16 L9,0 L4,5 L0,5 L0,5 Z" />
    </g>
  </g>
)

const oneThird = 1 / 3
const twoThird = oneThird * 2

const Volume = props => (
  <svg width="18px" height="19px" viewBox="0 0 18 19" {...props}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      {props.volume > twoThird ? up : props.volume > oneThird ? down : props.volume === 0 ? off : mute}
    </g>
  </svg>
)

module.exports = Volume