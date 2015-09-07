const React = require('react')
const random = (min, max) => Math.round(min + Math.random() * (max - min))
const getHeight = () => Math.max(window.innerHeight, document.body.scrollHeight)
const getWidth = () => Math.max(window.innerWidth, document.body.scrollWidth)

class Flake {
  constructor(opts) {
    this.minSize = opts.minSize || 1
    this.maxSize = opts.maxSize || 2
    this.minSpeed = opts.minSpeed || 1
    this.maxSpeed = opts.maxSpeed || 5
    this.reset()
    this.y = random(0, getHeight())
    this.step = 0
  }

  reset() {
    this.x = random(0, getWidth())
    this.y = random(0, this.maxSpeed)
    this.size = random((this.minSize * 100), (this.maxSize * 100)) / 100
    this.speed = random(this.minSpeed, this.maxSpeed)
    this.stepSize = random(1, 10) / 100
  }

  tick() {
    this.step += this.stepSize
    this.x += Math.cos(this.step)
    this.y += this.speed
    if (this.y > getHeight() - this.size) {
      this.reset()
    }
  }
}

class Snowfall extends React.Component {
  componentWillMount() {
    this.flakes = []
    for (var i = 0; i < this.props.count; i++) {
      this.flakes.push(new Flake(this.props))
    }
  }

  componentDidMount() {
    this.canvas = this.refs.canvas.getDOMNode()
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = getWidth()
    this.canvas.height = getHeight()
    this.tick()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillReceiveProps() {
    this.resize()
  }

  resize() {
    var { canvas } = this
    canvas.style.display = 'none'
    canvas.width = getWidth()
    canvas.height = getHeight()
    canvas.style.display = 'block'
  }

  tick() {
    var { canvas, ctx } = this
    requestAnimationFrame(this.tick.bind(this))
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#FFF'
    var i = this.flakes.length
    while (i--) {
      var flake = this.flakes[i]
      flake.tick()
      ctx.fillRect(flake.x, flake.y, flake.size, flake.size)
    }
  }

  render() {
    return (
      <canvas id="snowfall" ref="canvas" />
    )
  }
}

module.exports = Snowfall