const landmarks = {
  male: {
    mouth: [602, 621, -7.5, 1],
    smilePatch: [524, 584, 157, 77],
    lip: ['#a56152', '#c38976', '#652f2c', '#f6bfa8'],
    eyeStrip: [365, 358, 420, 179],
    tears: [[515, 480, 45, -3], [671, 460, 40, 4]],
    cheeks: [[462, 525, 63, 38], [677, 505, 44, 34]],
    hair: ['M549 277 Q582 392 568 463 Q563 487 544 509', 'M347 252 Q300 297 229 322 Q203 331 186 309', 'M735 196 Q789 227 800 297 Q805 322 820 331'],
  },
  female: {
    mouth: [516, 622, -4, .95],
    smilePatch: [436, 578, 160, 87],
    lip: ['#c66e6d', '#e48886', '#742e3f', '#ffd9c4'],
    eyeStrip: [261, 322, 493, 221],
    tears: [[394, 486, 46, 3], [584, 456, 51, -3]],
    cheeks: [[408, 525, 69, 39], [619, 499, 73, 43]],
    hair: ['M481 167 Q444 290 469 394 Q489 446 518 470', 'M241 549 Q207 619 162 660 Q125 700 63 720', 'M805 455 Q845 517 889 542 Q950 583 954 662'],
  },
}

// The color across the exposed skin shifts slightly in each painted plate.
const mouthSkin = {
  ink: ['#d3a798', '#d9ab9d', '#e9b8a7'],
  ivory: ['#d7ada2', '#dcb1a5', '#e9bcae'],
  wine: ['#d6a898', '#dcac9d', '#ebb7a6'],
  blush: ['#edb9b4', '#edb5af', '#eebcb6'],
  nocturne: ['#efbeb8', '#edb9b3', '#efbeb8'],
  jade: ['#f0c0b9', '#efbcb5', '#f2c2bb'],
}

const moodPose = {
  neutral: { open: 0, corners: 0, flush: 0, tilt: 0 },
  smile: { open: 0, corners: .80, flush: .07, tilt: -.10 },
  shy: { open: 0, corners: .43, flush: .66, tilt: 1.45 },
  sad: { open: .045, corners: -.29, flush: .15, tilt: 1.20 },
  angry: { open: .035, corners: -.54, flush: .13, tilt: -.68 },
  surprised: { open: .48, corners: 0, flush: .06, tilt: -.71 },
}
const eyePoses = ['angry', 'surprised', 'smile', 'sad', 'blink']
const eyePosesFor = actor => actor === 'male' ? ['partner', ...eyePoses] : eyePoses
const mouthPoses = ['smile', 'sad']
const artBox = ([x, y, width, height]) => `x="${x}" y="${y}" width="${width}" height="${height}"`
const clamp01 = value => Math.max(0, Math.min(1, value))
const smooth = value => {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}

function eyeMarkup(actor, strip, art) {
  const area = artBox(strip)
  return `<defs>
      <linearGradient id="${actor}-eye-x"><stop stop-color="white" stop-opacity="0"/><stop offset=".17" stop-color="white"/><stop offset=".83" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
      <linearGradient id="${actor}-eye-y" x2="0" y2="1"><stop stop-color="white" stop-opacity="0"/><stop offset=".23" stop-color="white"/><stop offset=".77" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
      <mask id="${actor}-eye-width" maskUnits="userSpaceOnUse" ${area}><rect ${area} fill="url(#${actor}-eye-x)"/></mask>
      <mask id="${actor}-eye-height" maskUnits="userSpaceOnUse" ${area}><rect ${area} fill="url(#${actor}-eye-y)"/></mask>
    </defs>
    <g mask="url(#${actor}-eye-width)"><g mask="url(#${actor}-eye-height)">
      ${eyePosesFor(actor).map(mood => `<image class="eye-${mood}" opacity="0" ${area} href="${art(`${actor}-eyes-${mood}`)}"/>`).join('')}
    </g></g>`
}

function tearMarkup(actor, [x, y, width, tilt]) {
  return `<g class="tear" opacity="0" transform="translate(${x} ${y}) rotate(${tilt})">
    <path d="M${-width * .65} -3 Q-6 2 ${width * .70} -8" fill="none" stroke="#8a435c" stroke-opacity=".32" stroke-width="2.3" stroke-linecap="round"/>
    <path d="M${-width * .54} -4 Q-6 1 ${width * .61} -8" fill="none" stroke="url(#${actor}-wet-line)" stroke-width="1.6" stroke-linecap="round"/>
    <g class="tear-track">
      <path d="M2 1 C4 10 2 20 -2 34" fill="none" stroke="url(#${actor}-tear-light)" stroke-width="2" stroke-linecap="round"/>
      <g class="tear-drop">
        <path d="M0 -7 Q-5 1 -4 5 C-3 10 4 9 5 4 Q6 1 0 -7Z" fill="url(#${actor}-water)" stroke="#593d62" stroke-opacity=".26" stroke-width=".95"/>
        <path d="M-1.4 5 Q.5 6.4 2.5 3.4" stroke="#fff7ed" opacity=".92" stroke-width="1.45" stroke-linecap="round" fill="none"/>
      </g>
    </g>
  </g>`
}

function mouthMarkup(actor, { mouth, smilePatch, lip }, art) {
  const [x, y, tilt, scale] = mouth
  return `<defs>
    <radialGradient id="${actor}-skin-fade"><stop offset=".75" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient>
    <mask id="${actor}-skin-mask" maskUnits="userSpaceOnUse" x="-83" y="-38" width="166" height="80"><ellipse cy="2" rx="83" ry="40" fill="url(#${actor}-skin-fade)"/></mask>
    <linearGradient id="${actor}-skin"><stop class="skin-color"/><stop class="skin-color" offset=".48"/><stop class="skin-color" offset="1"/></linearGradient>
    <linearGradient id="${actor}-upper-lip" x2="0" y2="1"><stop stop-color="${lip[0]}" stop-opacity="0"/><stop offset=".46" stop-color="${lip[0]}" stop-opacity=".79"/><stop offset="1" stop-color="${lip[2]}" stop-opacity=".95"/></linearGradient>
    <linearGradient id="${actor}-lower-lip" x2="0" y2="1"><stop stop-color="${lip[2]}" stop-opacity=".69"/><stop offset=".36" stop-color="${lip[1]}"/><stop offset=".67" stop-color="${lip[1]}" stop-opacity=".71"/><stop offset="1" stop-color="${lip[0]}" stop-opacity="0"/></linearGradient>
    <radialGradient id="${actor}-cavity" cx=".57" cy=".93" r=".87"><stop stop-color="#9f5659"/><stop offset=".49" stop-color="#653134"/><stop offset="1" stop-color="#3b2027"/></radialGradient>
    <linearGradient id="${actor}-teeth" x2="0" y2="1"><stop stop-color="#cb9990"/><stop offset="1" stop-color="#ffe5d8"/></linearGradient>
    <linearGradient id="${actor}-tongue" x2="0" y2="1"><stop stop-color="#a96270"/><stop offset="1" stop-color="#783846"/></linearGradient>
    <radialGradient id="${actor}-chin-shadow"><stop stop-color="${lip[2]}" stop-opacity=".19"/><stop offset="1" stop-color="${lip[2]}" stop-opacity="0"/></radialGradient>
    <clipPath id="${actor}-mouth-clip"><path class="mouth-clip"/></clipPath>
  </defs>
  ${mouthPoses.map(pose => `<image class="mouth-${pose}" ${artBox(smilePatch)} opacity="0" href="${art(`${actor}-mouth-${pose}`)}"/>`).join('')}
  <g class="mouth" transform="translate(${x} ${y}) rotate(${tilt}) scale(${scale})" opacity="0">
    <rect x="-83" y="-38" width="166" height="80" fill="url(#${actor}-skin)" mask="url(#${actor}-skin-mask)"/>
    <ellipse class="chin-shadow" cx="2" cy="21" rx="27" ry="9" fill="url(#${actor}-chin-shadow)"/>
    <path class="upper-lip" fill="url(#${actor}-upper-lip)"/>
    <path class="lower-lip" fill="url(#${actor}-lower-lip)"/>
    <path class="mouth-opening" fill="url(#${actor}-cavity)"/>
    <g clip-path="url(#${actor}-mouth-clip)">
      <path class="teeth" fill="url(#${actor}-teeth)"/>
      <path class="tongue" fill="url(#${actor}-tongue)"/>
    </g>
    <path class="lip-light" fill="none" stroke="${lip[3]}" stroke-width="1.55" stroke-linecap="round"/>
  </g>`
}

function markup(actor, outfit, art) {
  const { eyeStrip, cheeks, hair, tears } = landmarks[actor]
  return `<svg class="actor-body" viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="${actor}-silhouette" maskUnits="userSpaceOnUse" style="mask-type:alpha" x="0" y="0" width="1024" height="1536"><use href="#${actor}-sprite"/></mask>
      <linearGradient id="${actor}-sign" x1="${actor === 'male' ? 1 : 0}" x2="${actor === 'male' ? 0 : 1}">
        <stop stop-color="#8abfdd" stop-opacity=".34"/><stop offset=".34" stop-color="#72a9e1" stop-opacity=".095"/><stop offset=".66" stop-color="#efb793" stop-opacity="0"/><stop offset="1" stop-color="#f3a578" stop-opacity=".31"/>
      </linearGradient>
      <filter id="${actor}-night-grade" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feColorMatrix values=".84 .095 .02 0 .003 .04 .83 .07 0 .006 .07 .20 .82 0 .010 0 0 0 1 0"/>
      </filter>
      <radialGradient id="${actor}-blush"><stop stop-color="#d4536a" stop-opacity=".51"/><stop offset=".54" stop-color="#dc6a7e" stop-opacity=".28"/><stop offset="1" stop-color="#e07689" stop-opacity="0"/></radialGradient>
      <linearGradient id="${actor}-lock"><stop stop-color="#ffbfb8" stop-opacity="0"/><stop offset=".62" stop-color="#ffb5ba"/><stop offset="1" stop-color="#ffbfb8" stop-opacity="0"/></linearGradient>
      <linearGradient id="${actor}-wet-line"><stop stop-color="#ffd9e3" stop-opacity="0"/><stop offset=".63" stop-color="#fff1e6"/><stop offset="1" stop-color="#fff4fb" stop-opacity="0"/></linearGradient>
      <linearGradient id="${actor}-tear-light" x2="0" y2="1"><stop stop-color="#f6b9bb" stop-opacity="0"/><stop offset=".42" stop-color="#ffe4db" stop-opacity=".71"/><stop offset="1" stop-color="#f5d2ec" stop-opacity="0"/></linearGradient>
      <radialGradient id="${actor}-water" cx=".54" cy=".63" r=".72"><stop stop-color="#ffe8e5" stop-opacity=".19"/><stop offset=".60" stop-color="#d2a2b7" stop-opacity=".49"/><stop offset="1" stop-color="#fff0eb" stop-opacity=".83"/></radialGradient>
    </defs>
    <g>
      <image class="sprite" id="${actor}-sprite" href="${art(outfit)}" width="1024" height="1536"/>
      ${eyeMarkup(actor, eyeStrip, art)}
      <g class="hair" fill="none" stroke="url(#${actor}-lock)" stroke-linecap="round">
        ${hair.map((path, i) => `<path d="${path}" stroke-width="${i === 0 ? 1.55 : 2.2}"/>`).join('')}
      </g>
      ${tears.map(eye => tearMarkup(actor, eye)).join('')}
      <g class="blush" opacity="0">
        ${cheeks.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${actor}-blush)"/><path d="M${cx - 9} ${cy + 6} l6 -6 m3 6 6 -7" stroke="#e9808c" opacity=".38" stroke-width="1.6" stroke-linecap="round"/>`).join('')}
      </g>
      ${mouthMarkup(actor, landmarks[actor], art)}
      <g class="sign-light" mask="url(#${actor}-silhouette)">
        <rect width="1024" height="1536" fill="url(#${actor}-sign)"/>
      </g>
    </g>
  </svg>`
}

function mouthShape(open, round, spread, smile, direction) {
  const width = 45 - 20 * round + 12 * spread
  const gap = 1.1 + open * (25 + 6 * round)
  const top = -gap * .37
  const bottom = gap * .70
  const bow = -3.1 + round * 2.6
  const lift = -smile * 8
  const left = lift + direction * (1.7 + smile * 1.9) + open * 2
  const right = lift - direction * (1.7 + smile * 1.9) + open * 2
  const f = value => Number(value.toFixed(2))
  const end = `${f(width)} ${f(right)}`
  const start = `${f(-width)} ${f(left)}`
  const upper = `M${start} C${f(-width * .70)} ${f(left - 1)} ${f(-width * .33)} ${f(top + bow)} 0 ${f(top)} C${f(width * .32)} ${f(top + bow)} ${f(width * .73)} ${f(right - 2)} ${end}`
  const lower = `C${f(width * .64)} ${f(bottom * .41 + right * .59)} ${f(width * .46)} ${f(bottom - 1)} 1 ${f(bottom)} C${f(-width * .37)} ${f(bottom + .5)} ${f(-width * .63)} ${f(bottom * .41 + left * .59)} ${start}`
  return {
    upperLip: `${upper} Q${f(width * .52)} ${f(top - 9)} ${f(width * .21)} ${f(top - 11)} Q6 ${f(top - 11)} 0 ${f(top - 8)} Q-10 ${f(top - 13)} ${f(-width * .28)} ${f(top - 10)} Q${f(-width * .64)} ${f(top - 6)} ${start}Z`,
    lowerLip: `M${end} ${lower} C${f(-width * .60)} ${f(bottom + 9)} ${f(-width * .34)} ${f(bottom + 14)} 2 ${f(bottom + 13)} Q${f(width * .62)} ${f(bottom + 13)} ${end}Z`,
    opening: `${upper} ${lower}Z`,
    teeth: `M${f(-width * .83)} ${f(top - 6)} L${f(width * .83)} ${f(top - 6)} ${f(width * .67)} ${f(top + 2)} Q5 ${f(top + 6 + Math.min(1.8, gap * .15))} ${f(-width * .69)} ${f(top + 2)}Z`,
    tongue: `M${f(-width * .58)} ${f(bottom + 2)} Q${f(-width * .43)} ${f(bottom - gap * .33)} 2 ${f(bottom - gap * .18)} Q${f(width * .43)} ${f(bottom - gap * .44)} ${f(width * .59)} ${f(bottom + 1)}Z`,
    light: `M${f(-width * .30)} ${f(bottom + 5.4)} Q${f(-width * .16)} ${f(bottom + 6.6)} -3 ${f(bottom + 6.7)} M2 ${f(bottom + 6.7)} Q${f(width * .16)} ${f(bottom + 6.1)} ${f(width * .26)} ${f(bottom + 4.8)}`,
    shadowAt: f(bottom + 18),
  }
}

function motionPose(name, idle, time, gesture, motion, tilt) {
  const wind = Math.sin(idle * .91)
  const breath = Math.sin(idle * 1.59)
  const direction = name === 'male' ? 1 : -1
  const pulse = motion ? smooth(time / .35) * (1 - smooth((time - .52) / .72)) : 0
  const nod = gesture === 'nod' && motion ? smooth(time / .25) * (1 - smooth((time - .32) / .37)) : 0
  const turn = gesture === 'tilt' ? 2.15 * pulse : 0
  const lean = gesture === 'lean' ? pulse : 0
  return {
    wind, breath,
    transform: `translate(${(wind * .25 + direction * lean * 2.4).toFixed(3)}%, ${(breath * .17 + nod * .91 - lean * .26).toFixed(3)}%) rotate(${(tilt + wind * .28 + direction * (turn + lean * 1.19 + nod * .91)).toFixed(3)}deg) scale(${(1 + lean * .021).toFixed(4)}, ${(1 + breath * .004 + nod * .005 + lean * .012).toFixed(4)})`,
  }
}

export function makeActor(name, outfit, art) {
  const root = document.createElement('div')
  root.className = 'actor'
  root.dataset.actor = name
  const direction = name === 'male' ? 1 : -1
  root.style.setProperty('--angle', `${direction * -1.5}deg`)
  root.innerHTML = markup(name, outfit, art)
  const find = selector => root.querySelector(selector)
  const body = find('.actor-body')
  const sprite = find('.sprite')
  const hair = find('.hair')
  const blush = find('.blush')
  const eyeLayers = Object.fromEntries(eyePosesFor(name).map(key => [key, find(`.eye-${key}`)]))
  const tears = Array.from(root.querySelectorAll('.tear'), layer => ({
    layer, track: layer.querySelector('.tear-track'), drop: layer.querySelector('.tear-drop'),
  }))
  const mouth = find('.mouth')
  const mouthLayers = Object.fromEntries(mouthPoses.map(pose => [pose, find(`.mouth-${pose}`)]))
  const paths = Object.fromEntries(Object.entries({
    upperLip: '.upper-lip', lowerLip: '.lower-lip', opening: '.mouth-opening',
    teeth: '.teeth', tongue: '.tongue', light: '.lip-light',
  }).map(([key, selector]) => [key, find(selector)]))
  const clip = find('.mouth-clip')
  const shadow = find('.chin-shadow')
  const skin = root.querySelectorAll('.skin-color')
  const lastOpacity = new WeakMap()
  let lastMouth = ''

  function opacity(layer, value) {
    const rounded = Math.round(clamp01(value) * 100) / 100
    if (lastOpacity.get(layer) !== rounded) {
      layer.setAttribute('opacity', rounded)
      lastOpacity.set(layer, rounded)
    }
  }

  function render({ time, mood, idleTime, voice, gesture, motion, gazeAt, strength, tearTime }) {
    const { open, corners, flush, tilt } = moodPose[mood]
    if (root.dataset.mood !== mood) root.dataset.mood = mood
    const phase = name === 'male' ? 1.2 : 3.4
    const idle = motion ? idleTime + phase : phase
    const blinkPeriod = name === 'male' ? 5.13 : 4.73
    const blinkPhase = idle % blinkPeriod
    const blink = motion ? smooth(1.5 - Math.abs(blinkPhase - .12) * 14) : 0
    const expression = mood === 'shy' ? 'smile' : mood
    const expressionWeight = smooth(strength)
    const partner = smooth((gazeAt - .31) / .39) * (mood === 'neutral' ? 1 : 1 - expressionWeight)
    for (const [pose, layer] of Object.entries(eyeLayers)) {
      const weight = pose === 'blink' ? blink : pose === 'partner' ? partner : pose === expression ? expressionWeight : 0
      opacity(layer, weight)
    }
    opacity(blush, flush * strength)
    for (const [i, { layer, track, drop }] of tears.entries()) {
      const visible = mood === 'sad' ? strength * (1 - blink * .35) : 0
      const drops = name === 'male' ? i === 1 : i === 0
      const run = motion ? smooth(tearTime / .92) : .58
      opacity(layer, visible)
      opacity(track, drops ? smooth(run * 2.4) : 0)
      if (visible && drops) drop.setAttribute('transform', `translate(${(2 - run * 4).toFixed(2)} ${(4 + run * 26).toFixed(2)})`)
    }

    const pose = motionPose(name, idle, time, gesture, motion, tilt * strength)
    if (body.style.transform !== pose.transform) body.style.transform = pose.transform
    const hairPose = `rotate(${(.39 * pose.wind).toFixed(2)}deg) translateX(${(.30 * pose.breath).toFixed(2)}%)`
    if (hair.style.transform !== hairPose) hair.style.transform = hairPose
    opacity(hair, .29 + pose.breath * .08)

    const restingPose = mood === 'shy' ? 'smile' : mood
    const paintedMouth = mouthLayers[restingPose]
    const mouthAmount = Math.max(smooth(voice.activity * (1 - voice.seal) / .61), paintedMouth || mood === 'neutral' ? 0 : strength)
    for (const layer of Object.values(mouthLayers)) {
      opacity(layer, layer === paintedMouth ? expressionWeight * (1 - smooth(mouthAmount / .78)) : 0)
    }
    opacity(mouth, mouthAmount)
    if (!mouthAmount) return
    const openness = Math.max(open * strength * (1 - .62 * voice.activity), voice.jaw)
    const rounding = voice.round + (mood === 'surprised' ? .68 * strength * (1 - voice.activity) : 0)
    opacity(paths.teeth, smooth((openness - .21) / .37) * (1 - rounding) * voice.activity * .83)
    opacity(paths.tongue, smooth((openness - .24) / .45) * .64)
    opacity(paths.light, name === 'male' ? .55 : .75)
    const shapeKey = [openness, rounding, voice.spread, corners * strength].map(value => Math.round(value * 100)).join('/')
    if (lastMouth === shapeKey) return
    lastMouth = shapeKey
    const shape = mouthShape(openness, rounding, voice.spread, corners * strength, direction)
    for (const [key, path] of Object.entries(paths)) path.setAttribute('d', shape[key])
    clip.setAttribute('d', shape.opening)
    shadow.setAttribute('cy', shape.shadowAt)
  }

  return {
    root, render,
    outfit(value) {
      if (root.dataset.outfit !== value) {
        root.dataset.outfit = value
        sprite.setAttribute('href', art(value))
        skin.forEach((stop, index) => stop.setAttribute('stop-color', mouthSkin[value][index]))
      }
    },
  }
}
