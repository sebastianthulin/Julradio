const React = require('react')
const random = (min, max) => Math.round(min + Math.random() * (max - min))

class Flake {
  constructor(opts, getHeight, getWidth) {
    this.getHeight = getHeight
    this.getWidth = getWidth
    this.numFlakes = opts.count
    this.minSize = opts.minSize || 1
    this.maxSize = opts.maxSize || 2
    this.minSpeed = opts.minSpeed || 1
    this.maxSpeed = opts.maxSpeed || 5
    this.reset()
    this.visible = false
    this.shouldDie = !opts.active
    this.step = 0
    this.y = random(0, this.getHeight())
  }

  reset() {
    this.visible = !this.shouldDie
    this.x = random(0, this.getWidth())
    this.y = random(0, this.maxSpeed)
    this.size = random((this.minSize * 100), (this.maxSize * 100)) / 100
    this.speed = random(this.minSpeed, this.maxSpeed)
    this.stepSize = random(1, 10) / 100
  }

  tick() {
    this.step += this.stepSize
    this.x += Math.cos(this.step)
    this.y += this.speed
    if (this.y > this.getHeight() - this.size) {
      this.reset()
    }
  }

  kill() {
    this.shouldDie = true
  }

  resume() {
    this.shouldDie = false
  }
}

class Snowfall extends React.Component {
  componentDidMount() {
    this.flakes = []
    this.canvas = this.refs.canvas
    this.parent = this.canvas.parentNode
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.getWidth()
    this.canvas.height = this.getHeight()
    window.addEventListener('resize', this.resize.bind(this))

    for (var i = 0; i < this.props.count; i++) {
      this.flakes.push(new Flake(this.props, this.getHeight.bind(this), this.getWidth.bind(this)))
    }
    this.tick()
  }

  componentWillReceiveProps(props) {
    if (this.props.active !== props.active) {
      props.active ? this.resume() : this.kill()
    }
  }

  getHeight() {
    return this.parent.clientHeight
  }

  getWidth() {
    return this.parent.clientWidth
  }

  resize() {
    const { canvas } = this
    canvas.width = this.getWidth()
    canvas.height = this.getHeight()
  }

  tick() {
    const { canvas, ctx } = this
    requestAnimationFrame(this.tick.bind(this))
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#FFF'
    var i = this.flakes.length
    while (i--) {
      var flake = this.flakes[i]
      flake.tick()
      flake.visible && ctx.fillRect(flake.x, flake.y, flake.size, flake.size)
    }
  }

  kill() {
    this.flakes.forEach(flake => flake.kill())
  }

  resume() {
    this.flakes.forEach(flake => flake.resume())
  }

  render() {
    return <canvas id="Snowfall" ref="canvas" />
  }
}

module.exports = Snowfall