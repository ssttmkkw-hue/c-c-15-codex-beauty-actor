function seeded(seed) {
  return () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
    return seed / 4294967296
  }
}

const petal = new Path2D('M-1 .2 C-.68 -.48 -.22 -.71 .41 -.59 L.35 -.34 Q.6 -.37 .79 -.47 C1.04 .11 .42 .73 -.25 .53 Q-.72 .45 -1 .2Z')
const vein = new Path2D('M-.86 .2 Q-.21 .24 .48 -.31')
const wrap = (value, span) => ((value % span) + span) % span

function softLight(inner, outer) {
  const image = document.createElement('canvas')
  image.width = 96
  image.height = 96
  const ctx = image.getContext('2d')
  const falloff = ctx.createRadialGradient(48, 48, 1, 48, 48, 48)
  falloff.addColorStop(0, inner)
  falloff.addColorStop(.38, outer)
  falloff.addColorStop(.7, outer.slice(0, 7) + '28')
  falloff.addColorStop(1, outer.slice(0, 7) + '00')
  ctx.fillStyle = falloff
  ctx.fillRect(0, 0, 96, 96)
  return image
}

function layer(canvas, foreground) {
  const ctx = canvas.getContext('2d')
  const random = seeded(foreground ? 1447 : 3551)
  const weather = Array.from({ length: foreground ? 22 : 42 }, () => ({
    x: random(), y: random(), spin: random() * 6.28, speed: random(), size: random(),
  }))
  const lights = Array.from({ length: foreground ? 5 : 26 }, () => ({
    x: random(), y: random(), size: random(), phase: random() * 6.28,
  }))
  const duskGlow = softLight('#ffdcb6cc', '#ffc38982')
  const duskRose = softLight('#ffe0ed9c', '#f5aebc5e')
  const rainGlow = softLight('#e1e9ffcc', '#87b5f391')
  const rainRose = softLight('#ffe0ebcc', '#ee8fc782')
  let width = 0
  let height = 0
  let lastPaint = -1
  let lastSet
  let lastFraming

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

  function draw(time, backdrop, shot, focus, cutaway) {
    const tick = Math.floor(time * 45)
    const framing = cutaway ?? `${shot}/${focus}`
    if (!width || !height || (lastPaint === tick && lastSet === backdrop && lastFraming === framing)) return
    lastPaint = tick
    lastSet = backdrop
    lastFraming = framing
    ctx.clearRect(0, 0, width, height)
    if (cutaway && !foreground) return
    const night = backdrop === 'night'
    const scale = Math.max(.58, height / 540)
    const close = shot === 'close'
    const warm = night ? rainGlow : duskGlow
    const accent = night ? rainRose : duskRose
    const faceCenters = shot === 'pair' || cutaway === 'closing' ? [.32, .68] : [focus === 'male' ? .42 : .58]

    for (const [index, light] of lights.entries()) {
      if (cutaway && index > 2) break
      const x = width * (foreground ? (index % 2 ? .82 + light.x * .24 : light.x * .17) : light.x)
      const y = height * (foreground ? .2 + light.y * .8 : (night ? .30 : .58) + light.y * .28)
      const radius = scale * (foreground ? 25 + light.size * 52 : (close ? 5 : 2) + light.size * (close ? 27 : 11))
      ctx.globalAlpha = (foreground ? .25 : .37) * (.83 + .17 * Math.sin(time * .7 + light.phase))
      ctx.drawImage(index % 3 ? warm : accent, x - radius, y - radius, radius * 2, radius * 2)
    }

    for (const [index, mote] of weather.entries()) {
      if (!night && index >= (cutaway ? 6 : foreground ? 8 : 19)) break
      const spin = mote.spin + time * (mote.speed + .25)
      const x = wrap(mote.x * width + time * (night ? -39 : 11 + mote.speed * 19) * scale + Math.sin(spin) * 16 + 48, width + 96) - 48
      const y = wrap(mote.y * height + time * (night ? 200 + mote.speed * 260 : 15 + mote.speed * 20) * scale + 28, height + 56) - 28
      const size = (foreground ? 3.6 + mote.size * 7 : 1.1 + mote.size * 3.5) * scale
      if (night) {
        const length = size * 5 + 6
        ctx.globalAlpha = (foreground ? .14 : .07) + mote.size * .19
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - length * .162, y + length)
        ctx.lineWidth = (foreground ? 1.25 : .8) * scale
        ctx.strokeStyle = index % 4 === 0 ? '#edb7ce' : '#c0daff'
        ctx.stroke()
      } else {
        const flip = Math.sin(spin)
        const nearFace = foreground && faceCenters.some(center =>
          Math.hypot((x / width - center) / .18, (y / height - .44) / .29) < 1)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(spin * .55 + index)
        ctx.scale(size, size * (.21 + Math.abs(flip) * .66))
        ctx.globalAlpha = (.23 + mote.size * .43) * (nearFace ? .20 : 1)
        ctx.fillStyle = flip > 0 ? '#ffcec3' : '#cd759e'
        ctx.fill(petal)
        if (foreground && mote.size > .40) {
          ctx.lineWidth = .06
          ctx.strokeStyle = flip > 0 ? '#ffe2dd' : '#f29bb2'
          ctx.stroke(vein)
        }
        ctx.restore()
      }
    }
    ctx.globalAlpha = 1
  }
  return draw
}

export function makeParticles(stage) {
  const rear = layer(stage.querySelector('.rear'), false)
  const fore = layer(stage.querySelector('.fore'), true)
  return (time, backdrop, shot, focus, cutaway) => {
    rear(time, backdrop, shot, focus, cutaway)
    fore(time, backdrop, shot, focus, cutaway)
  }
}
