function seeded(seed) {
  return () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
    return seed / 4294967296
  }
}

function layer(canvas, foreground) {
  const ctx = canvas.getContext('2d')
  const random = seeded(foreground ? 1447 : 3551)
  const motes = Array.from({ length: foreground ? 19 : 46 }, () => ({
    x: random(), y: random(), spin: random() * 6.3, speed: random(),
    size: random(), glint: random(), color: random() > .45 ? '#ffb3ce' : '#f7d3e6',
  }))
  let width = 0
  let height = 0
  let lastPaint = -1
  let lastSet

  new ResizeObserver(() => {
    const box = canvas.getBoundingClientRect()
    width = box.width
    height = box.height
    const ratio = Math.min(devicePixelRatio, 1.5)
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    lastPaint = -1
  }).observe(canvas)

  const mod = (x, span) => ((x % span) + span) % span

  function draw(time, backdrop) {
    const tick = Math.floor(time * 45)
    if (!width || !height || (lastPaint === tick && lastSet === backdrop)) return
    lastPaint = tick
    lastSet = backdrop
    ctx.clearRect(0, 0, width, height)
    const night = backdrop === 'night'
    const ratio = Math.max(.66, height / 540)
    for (const mote of motes) {
      const x = mod(mote.x * width + time * (night ? -32 : 13 + mote.speed * 18) * ratio + Math.sin(mote.spin + time) * 12 + 40, width + 80) - 40
      const y = mod(mote.y * height + time * (night ? 180 + mote.speed * 360 : 12 + mote.speed * 24) * ratio + 20, height + 40) - 20
      if (mote.glint > .85) {
        const radius = ratio * ((foreground ? 9 : 3) + mote.size * (foreground ? 18 : 9))
        const halo = ctx.createRadialGradient(x, y, 0, x, y, radius)
        halo.addColorStop(0, night ? '#f7afe579' : '#ffd3d875')
        halo.addColorStop(.54, night ? '#b8c2ff3b' : '#ffbbc140')
        halo.addColorStop(1, '#ffbdce00')
        ctx.fillStyle = halo
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
        continue
      }
      const scale = (foreground ? 3 + mote.size * 7 : 1 + mote.size * 4) * ratio
      ctx.globalAlpha = night ? .17 + mote.size * .29 : .34 + mote.size * .42
      ctx.beginPath()
      if (night) {
        ctx.moveTo(x, y)
        ctx.lineTo(x - scale * .43, y + scale * 4.1 + 7)
        ctx.strokeStyle = '#d6cff9'
        ctx.lineWidth = .7 + .45 * mote.size
        ctx.stroke()
      } else {
        const spin = mote.spin + time * (mote.speed + .25)
        ctx.ellipse(x, y, scale, scale * (.25 + Math.abs(Math.sin(spin)) * .37), spin, 0, 2 * Math.PI)
        ctx.fillStyle = mote.color
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
  }
  return draw
}

export function makeParticles(stage) {
  const background = layer(stage.querySelector('.rear'), false)
  const foreground = layer(stage.querySelector('.fore'), true)
  return (time, backdrop) => {
    background(time, backdrop)
    foreground(time, backdrop)
  }
}
