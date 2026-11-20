const landmark = {
  male: {
    mouth: [604, 625, -7, 1],
    lips: ['#c58271', '#e5a08a', '#66362e', '#e9b6a4'],
    skin: ['#d4a799', '#d9ac9e', '#e6b8a7'],
    eyeStrip: [365, 358, 420, 179],
    eyes: [
      { x: 498, y: 469, tilt: -7, width: 51, bottom: 13 },
      { x: 664, y: 451, tilt: -12, width: 47, bottom: 12 },
    ],
    cheeks: [[460, 525, 60, 39], [677, 507, 42, 30]],
    hair: ['M549 277 Q582 392 568 463 Q563 487 544 509', 'M347 252 Q300 297 229 322 Q203 331 186 309', 'M735 196 Q789 227 800 297 Q805 322 820 331'],
  },
  female: {
    mouth: [516, 621, -4, .92],
    lips: ['#d78680', '#e9a195', '#7c3c40', '#f3b3a5'],
    skin: ['#ecb8b3', '#edb9b4', '#edbbb5'],
    eyeStrip: [261, 322, 493, 221],
    eyes: [
      { x: 387, y: 461, tilt: -11, width: 56, bottom: 24 },
      { x: 595, y: 433, tilt: -11, width: 60, bottom: 22 },
    ],
    cheeks: [[403, 526, 66, 37], [616, 500, 79, 42]],
    hair: ['M481 167 Q444 290 469 394 Q489 446 518 470', 'M241 549 Q207 619 162 660 Q125 700 63 720', 'M805 455 Q845 517 889 542 Q950 583 954 662'],
  },
}

const moodPose = {
  neutral: [0, 0, 0, 0, 0],
  smile: [.16, .38, 0, 0, .12],
  shy: [.04, .32, .72, 0, -.9],
  sad: [.07, -.66, .23, 1, 1.3],
  angry: [.12, -.75, .30, 0, -.7],
  surprised: [.64, 0, .1, 0, -.65],
}

function tearMarkup({ x, y, tilt, width, bottom }) {
  return `<g class="tears" opacity="0" transform="translate(${x} ${y}) rotate(${tilt})">
      <path d="M${-width + 9} 8 Q-5 ${bottom + 11} ${width - 7} 6" fill="none" stroke="#fff0f4" stroke-width="3" stroke-linecap="round" opacity=".78"/>
      <path d="M${width * .62} 12 Q${width * .58} 37 ${width * .51} 53 Q${width * .43} 63 ${width * .53} 70 Q${width * .68} 73 ${width * .72} 60 Q${width * .67} 46 ${width * .76} 13Z" fill="#b4dcff52" stroke="#feeaf4" stroke-width="1.6"/>
      <path d="M${width * .59} 61 l2 -5" stroke="#fff5fe" stroke-width="2.5" stroke-linecap="round"/>
  </g>`
}

function eyeMarkup(actor, [x, y, width, height], art) {
  const area = `x="${x}" y="${y}" width="${width}" height="${height}"`
  return `<defs>
      <linearGradient id="${actor}-eye-x"><stop stop-color="white" stop-opacity="0"/><stop offset=".13" stop-color="white"/><stop offset=".87" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
      <linearGradient id="${actor}-eye-y" x2="0" y2="1"><stop stop-color="white" stop-opacity="0"/><stop offset=".21" stop-color="white"/><stop offset=".79" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
      <mask id="${actor}-eye-width" maskUnits="userSpaceOnUse" ${area}><rect ${area} fill="url(#${actor}-eye-x)"/></mask>
      <mask id="${actor}-eye-height" maskUnits="userSpaceOnUse" ${area}><rect ${area} fill="url(#${actor}-eye-y)"/></mask>
    </defs>
    <g mask="url(#${actor}-eye-width)"><g mask="url(#${actor}-eye-height)">
      ${['angry', 'surprised', 'blink'].map(mood => `<image class="eye-${mood}" opacity="0" ${area} href="${art(`${actor}-eyes-${mood}`)}"/>`).join('')}
    </g></g>`
}

function markup(actor, outfit, art) {
  const { mouth, lips, skin, eyes, eyeStrip, cheeks, hair } = landmark[actor]
  const [x, y, tilt, scale] = mouth
  return `<svg class="actor-body" viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${actor}-skin-fade"><stop offset=".66" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient>
      <mask id="${actor}-skin-mask" maskUnits="userSpaceOnUse" x="-82" y="-45" width="164" height="90"><ellipse rx="82" ry="45" fill="url(#${actor}-skin-fade)"/></mask>
      <linearGradient id="${actor}-skin"><stop stop-color="${skin[0]}"/><stop offset=".47" stop-color="${skin[1]}"/><stop offset="1" stop-color="${skin[2]}"/></linearGradient>
      <radialGradient id="${actor}-blush"><stop stop-color="#e36886" stop-opacity=".83"/><stop offset=".52" stop-color="#dc6a83" stop-opacity=".58"/><stop offset="1" stop-color="#d95176" stop-opacity="0"/></radialGradient>
      <linearGradient id="${actor}-lip" x2="0" y2="1"><stop stop-color="${lips[0]}" stop-opacity=".54"/><stop offset=".44" stop-color="${lips[0]}"/><stop offset=".75" stop-color="${lips[1]}"/><stop offset="1" stop-color="${lips[0]}" stop-opacity=".05"/></linearGradient>
      <linearGradient id="${actor}-cavity" x2="0" y2="1"><stop stop-color="#3d1d29"/><stop offset="1" stop-color="#8a4651"/></linearGradient>
      <linearGradient id="${actor}-lock"><stop stop-color="#ffbfb8" stop-opacity="0"/><stop offset=".65" stop-color="#ffb5ba"/><stop offset="1" stop-color="#ffbfb8" stop-opacity="0"/></linearGradient>
    </defs>
    <image class="sprite" href="${art(outfit)}" width="1024" height="1536"/>
    ${eyeMarkup(actor, eyeStrip, art)}
    <g class="hair" fill="none" stroke="url(#${actor}-lock)" stroke-linecap="round">
      ${hair.map((path, i) => `<path d="${path}" stroke-width="${i === 0 ? 1.8 : 2.55}"/>`).join('')}
    </g>
    ${eyes.map(tearMarkup).join('')}
    <g class="blush" opacity="0">
      ${cheeks.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${actor}-blush)"/><path d="M${cx - 17} ${cy + 1} l6 -9 m3 10 6 -9 m3 8 6 -9" stroke="#f8acb0" opacity=".54" stroke-width="2" stroke-linecap="round"/>`).join('')}
    </g>
    <g class="mouth" transform="translate(${x} ${y}) rotate(${tilt}) scale(${scale})" opacity="0">
      <rect x="-82" y="-45" width="164" height="90" fill="url(#${actor}-skin)" mask="url(#${actor}-skin-mask)"/>
      <path class="lip-color" fill="url(#${actor}-lip)"/>
      <path class="mouth-opening" fill="url(#${actor}-cavity)" stroke="${lips[2]}" stroke-width="1.35"/>
      <path class="teeth" fill="#ffe4db"/>
      <path class="lip-light" fill="none" stroke="${lips[3]}" stroke-width="1.75" stroke-linecap="round"/>
    </g>
  </svg>`
}

function mouthShape(open, round, smile) {
  const width = 49 - 31 * round
  const gap = 1.8 + open * (17 + 15 * round)
  const corner = -smile * 14 + open * 2
  const upper = -gap * .46
  const lower = gap * .66
  return {
    lips: `M${-width} ${corner} Q${-width * .28} ${upper - 11} 0 ${upper - 7} Q${width * .39} ${upper - 12} ${width} ${corner} Q${width * .47} ${lower + 13} 1 ${lower + 14} Q${-width * .47} ${lower + 13} ${-width} ${corner}Z`,
    opening: `M${-width} ${corner} Q${-width * .40} ${upper - 2} 0 ${upper} Q${width * .32} ${upper - 2} ${width} ${corner} Q${width * .46} ${lower} 0 ${lower} Q${-width * .46} ${lower + 1} ${-width} ${corner}Z`,
    teeth: `M${-width * .72} ${corner * .6 + upper * .4} Q0 ${upper - 1.4} ${width * .72} ${corner * .6 + upper * .4} Q0 ${upper + gap * .39} ${-width * .72} ${corner * .6 + upper * .4}Z`,
    light: `M${-width * .27} ${lower + 5} Q0 ${lower + 7} ${width * .31} ${lower + 3}`,
  }
}

export function makeActor(name, outfit, art) {
  const root = document.createElement('div')
  root.className = 'actor'
  root.dataset.actor = name
  root.style.setProperty('--angle', name === 'male' ? '-2deg' : '2deg')
  root.innerHTML = markup(name, outfit, art)
  const find = selector => root.querySelector(selector)
  const body = find('.actor-body')
  const sprite = find('.sprite')
  const hair = find('.hair')
  const mouth = find('.mouth')
  const blush = find('.blush')
  const lid = find('.eye-blink')
  const anger = find('.eye-angry')
  const surprise = find('.eye-surprised')
  const tears = root.querySelectorAll('.tears')
  const mouthPaths = ['.lip-color', '.mouth-opening', '.teeth', '.lip-light'].map(find)
  let lastMouth = ''
  let lastMood = ''
  let lastBlink = 0

  function render({ time, mood, idleTime, voice, gesture, motion }) {
    const [baseOpen, smile, flush, tear, tilt] = moodPose[mood]
    if (lastMood !== mood) {
      lastMood = mood
      root.dataset.mood = mood
      blush.setAttribute('opacity', flush)
      for (const layer of tears) layer.setAttribute('opacity', tear)
      anger.setAttribute('opacity', mood === 'angry' ? '1' : '0')
      surprise.setAttribute('opacity', mood === 'surprised' ? '1' : '0')
    }
    const phase = name === 'male' ? 1.2 : 3.4
    const idle = motion ? idleTime + phase : phase
    const blinkPhase = idle % (name === 'male' ? 5.13 : 4.73)
    const blink = motion ? Math.round(Math.min(1, Math.max(0, 2.5 - Math.abs(blinkPhase - .12) * 23)) * 20) / 20 : 0
    if (lastBlink !== blink) {
      lid.setAttribute('opacity', blink)
      lastBlink = blink
    }
    const swing = Math.sin(idle * .92)
    const breath = Math.sin(idle * 1.83)
    const pulse = motion && time < 1.55 ? Math.sin(Math.PI * time / 1.55) ** 2 : 0
    const nod = gesture === 'nod' ? Math.sin(time * 8) * pulse : 0
    const turn = gesture === 'tilt' ? 2.6 * pulse : 0
    const lean = gesture === 'lean' ? pulse : 0
    const direction = name === 'male' ? 1 : -1
    body.style.transform = `translate(${(swing * .35 + direction * lean * 1.6).toFixed(3)}%, ${(breath * .24 + nod * .9).toFixed(3)}%) rotate(${(tilt + swing * .42 + direction * (turn + lean * 1.9) + nod * 1.65).toFixed(3)}deg) scaleY(${(1 + breath * .004 + nod * .010).toFixed(4)})`
    hair.style.transformOrigin = '49% 18%'
    hair.style.transform = `rotate(${(swing * .62).toFixed(2)}deg) translateX(${(breath * .4).toFixed(2)}%)`
    hair.setAttribute('opacity', (.40 + breath * .12).toFixed(2))

    const talking = voice.energy > .025
    const mouthOpacity = mood !== 'neutral' ? 1 : Math.min(1, voice.energy * 12)
    const openness = talking ? Math.max(baseOpen, voice.energy) : baseOpen
    const roundness = talking ? voice.round : mood === 'surprised' ? .83 : 0
    const pose = [mouthOpacity.toFixed(2), Math.round(openness * 40), Math.round(roundness * 20), smile].join('/')
    if (pose === lastMouth) return
    lastMouth = pose
    mouth.setAttribute('opacity', mouthOpacity.toFixed(2))
    if (mouthOpacity) {
      const shape = mouthShape(openness, roundness, smile)
      Object.values(shape).forEach((path, index) => mouthPaths[index].setAttribute('d', path))
      mouthPaths[2].setAttribute('opacity', openness > .34 && roundness < .6 ? '.82' : '0')
    }
  }

  return {
    root, render,
    outfit(value) {
      if (root.dataset.outfit !== value) {
        root.dataset.outfit = value
        sprite.setAttribute('href', art(value))
      }
    },
  }
}
