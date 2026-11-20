// Paintable Mandarin mouth targets: jaw opening, lip rounding and horizontal spread.
const open = [.91, .06, .17]
const spread = [.34, .03, .78]
const rounded = [.64, .76, .03]
const pursed = [.27, .95, 0]
const middle = [.60, .19, .26]
const closed = [0, 0, 0]

export const silent = { jaw: 0, round: 0, spread: 0, activity: 0, seal: 0 }

const clamp01 = value => Math.min(1, Math.max(0, value))
const blend = (a, b, amount) => a.map((value, i) => value + (b[i] - value) * amount)
const smooth = value => {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}

function vowel(syllable) {
  if (syllable === 'wo') return rounded
  if (/^(j|q|x|y)u|ui$|u$/.test(syllable)) return pursed
  if (/uo|ong|ou/.test(syllable)) return rounded
  if (/a/.test(syllable)) return open
  if (/^(zh|ch|sh|r|z|c|s)i$/.test(syllable)) return middle
  if (/i|ie/.test(syllable)) return spread
  return middle
}

function energyAt(energy, step, time) {
  const frame = Math.max(0, time / step)
  const index = Math.floor(frame)
  const mix = frame - index
  return (energy[index] ?? 0) * (1 - mix) + (energy[index + 1] ?? 0) * mix
}

function clauseTargets([start, end, words], audio, step) {
  // Longer finals receive a bit more room. Audio dips adjust the nominal joins
  // inside a bounded window so strong vowels and labial closures stay legible.
  const weights = words.map(word => 1 + (/ang|eng|ong|ian|iao|uan|ai|ou/.test(word) ? .18 : 0))
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  const unit = (end - start) / total
  let elapsed = start
  const bounds = [start]
  for (const weight of weights.slice(0, -1)) {
    elapsed += weight * unit
    const range = Math.min(.065, unit * .24)
    let bestTime = elapsed
    let bestScore = Infinity
    for (let delta = -range; delta <= range; delta += .008) {
      const time = elapsed + delta
      const score = energyAt(audio, step, time) * .7 + Math.abs(delta / range) * .34
      if (score < bestScore) {
        bestTime = time
        bestScore = score
      }
    }
    bounds.push(bestTime)
  }
  bounds.push(end)
  return words.map((word, i) => ({
    from: bounds[i],
    to: bounds[i + 1],
    pose: vowel(word),
    labial: /^[bmp]/.test(word),
    glide: /^(w|shuo|zui|hui)/.test(word),
    tail: /[nm]g?$/.test(word),
    finish: /ao$/.test(word) ? rounded : /(?:ai|ui)$/.test(word) ? spread : null,
  }))
}

export function prepareSpeech(timing) {
  return timing.lines.map(line => {
    const energy = Array.from(line.envelope, hex => parseInt(hex, 16) / 15)
    return {
      ...line,
      energy,
      step: timing.step,
      syllables: line.clauses.flatMap(clause => clauseTargets(clause, energy, timing.step)),
    }
  })
}

export function sampleVoice(line, time) {
  const index = line.syllables.findIndex(({ from, to }) => time >= from - .035 && time < to)
  if (index === -1) return silent
  const target = line.syllables[index]
  const previous = line.syllables[index - 1]
  const next = line.syllables[index + 1]
  const local = (time - target.from) / (target.to - target.from)
  const joinIn = previous?.to === target.from
  const joinOut = next?.from === target.to
  const loudness = energyAt(line.energy, line.step, time - .024) * .22
    + energyAt(line.energy, line.step, time) * .5
    + energyAt(line.energy, line.step, time + .023) * .28

  let pose = target.glide ? blend(pursed, target.pose, smooth(local / .37)) : target.pose
  const seal = target.labial ? 1 - smooth((local - .095) / .21) : 0
  if (target.labial) pose = blend(pose, closed, seal)
  else if (joinIn && local < .22) pose = blend(previous.pose, pose, .46 + .54 * smooth(local / .22))
  if (target.finish && local > .50) pose = blend(pose, target.finish, smooth((local - .50) / .43) * .82)
  if (target.tail && local > .73) pose = blend(pose, middle, smooth((local - .73) / .27) * .43)
  if (joinOut && local > .76) pose = blend(pose, next.labial ? closed : next.pose, smooth((local - .76) / .24) * .46)

  const release = joinOut ? 1 : smooth((target.to - time) / .075)
  const audibility = smooth(loudness / .29) * release
  return {
    jaw: pose[0] * Math.min(1, loudness * .78 + .24) * audibility,
    round: pose[1] * audibility,
    spread: pose[2] * audibility,
    activity: audibility,
    seal,
  }
}
