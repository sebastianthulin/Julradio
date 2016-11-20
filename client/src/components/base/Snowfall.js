const React = require('react')

const createSnowfall = (canvas, opts) => {
  const ctx = canvas.getContext('2d')

  const random = (min, max) => Math.random() * (min - max) + max

  const createFlake = () => {
    const flake = {}
    flake.minSize = opts.minSize || 1
    flake.maxSize = opts.maxSize || 2
    flake.minSpeed = opts.minSpeed || 1
    flake.maxSpeed = opts.maxSpeed || 5
    resetFlake(flake)
    flake.visible = false
    flake.shouldDie = !opts.active
    flake.step = 0
    flake.y = random(0, canvas.height)
    return flake
  }

  const resetFlake = flake => {
    flake.visible = !flake.shouldDie
    flake.x = random(0, canvas.width)
    flake.y = canvas.height - flake.y
    flake.size = random((flake.minSize * 100), (flake.maxSize * 100)) / 100
    flake.speed = random(flake.minSpeed, flake.maxSpeed)
    flake.stepSize = random(1, 10) / 100
  }

  const flakes = Array.from(Array(opts.count), createFlake)

  const tick = () => {
    requestAnimationFrame(tick)
    const doClear = !!flakes.filter(flake => flake.visible).length > 0
    doClear && ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#FFF'
    for (let i = flakes.length; i--;) {
      const flake = flakes[i]
      flake.step += flake.stepSize
      flake.x += Math.cos(flake.step)
      flake.y += flake.speed
      if (flake.y > canvas.height - flake.size) {
        resetFlake(flake)
      }
      flake.visible && ctx.fillRect(flake.x, flake.y, flake.size, flake.size)
    }
  }

  tick()

  return shouldDie => {
    flakes.forEach(flake => flake.shouldDie = shouldDie)
  }
}

class Snowfall extends React.Component {
  componentDidMount() {
    this.canvas = this.refs.canvas
    this.resize()
    this.onSnowfallChange = createSnowfall(this.canvas, this.props)
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillReceiveProps(props) {
    if (this.props.active !== props.active) {
      this.resize()
      this.onSnowfallChange(!props.active)
    }
  }

  resize() {
    const {canvas} = this
    canvas.width = canvas.parentNode.clientWidth
    canvas.height = canvas.parentNode.clientHeight
  }

  render() {
    return <canvas id="Snowfall" ref="canvas" />
  }
}

module.exports = Snowfall
