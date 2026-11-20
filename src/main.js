import './style.css'
import { icon } from './icons.js'
import { makeParticles } from './particles.js'
import { makeActor } from './rig.js'
import { cast, expressions, shots, backdrops, gestures, beats } from './scenes.js'
import timing from './voice-timing.json'

const byId = id => document.getElementById(id)
const stage = byId('stage')
const seek = byId('seek')
const player = byId('player')
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const base = import.meta.env.BASE_URL
const art = name => `${base}art/${name}.webp`
const defaultWardrobe = Object.fromEntries(Object.entries(cast).map(([id, spec]) => [id, spec.wardrobe[0][0]]))
const manual = { actor: 'male', shot: 'pair', backdrop: 'roof', gesture: 'idle' }
const moods = { male: 'neutral', female: 'neutral' }
const wardrobe = { ...defaultWardrobe }
const swatches = { ink: '#3d3559', ivory: '#e3cbbc', wine: '#9b4c71', blush: '#d791ac', nocturne: '#45579b', jade: '#a5bba5' }
const optionSets = {
  actor: ['角色', Object.entries(cast).map(([id, character]) => [id, character.name]), 2],
  outfit: ['服装', cast.male.wardrobe, 3],
  mood: ['表情', expressions, 3],
  shot: ['镜头', shots, 3],
  backdrop: ['场景', backdrops, 2],
  gesture: ['动作', gestures, 4],
}
const actors = Object.fromEntries(Object.entries(defaultWardrobe).map(([actor, outfit]) => [actor, makeActor(actor, outfit, art)]))
const drawParticles = makeParticles(stage)
const silent = { energy: 0, round: 0 }
const lineAudio = timing.lines.map(line => ({
  ...line,
  energy: [...line.envelope].map(hex => parseInt(hex, 16) / 15),
}))

let mode = 'preview'
let position = 0
let playing = false
let audioAvailable = true
let mediaStarted = false
let playbackToken = 0
let fallbackTime = 0
let fallbackPosition = 0
let gestureTime = Infinity
let displayedKey = ''
let transportKey = ''
let transportPosition = -1
let loadedWardrobe
let previewTime
const startTime = performance.now()
const audio = new Audio(`${base}voice/before-sunset.mp3`)
audio.preload = 'auto'
audio.volume = .87

function setIcon(element, name) {
  element.innerHTML = icon(name)
}

for (const element of document.querySelectorAll('[data-icon]')) setIcon(element, element.dataset.icon)
for (const actor of Object.values(actors)) stage.querySelector('.cast').append(actor.root)

function optionMarkup(group, [id, label]) {
  let content = label
  if (group === 'actor') {
    content = `<span class="portrait" style="background-image:url('${art(defaultWardrobe[id])}')"></span><span><strong>${label}</strong><small>${cast[id].role}</small></span>`
  }
  if (group === 'outfit') content = `<i aria-hidden="true" class="swatch" style="--swatch:${swatches[id]}"></i>${label}`
  return `<button class="choice ${group === 'actor' ? 'cast-choice' : ''}" data-option="${id}" aria-pressed="false">${content}</button>`
}

const controls = byId('director-controls')
controls.innerHTML = Object.entries(optionSets).map(([id, [title, options, columns]]) => `<fieldset class="control-group" data-control="${id}">
  <legend>${title}</legend>
  <div class="control-options" style="--columns:${columns}">${options.map(option => optionMarkup(id, option)).join('')}</div>
</fieldset>`).join('')

const scriptList = byId('script-lines')
scriptList.innerHTML = beats.map((beat, index) => `<li><button data-line="${index}"><b>${cast[beat.actor].name}</b>${beat.zh}</button></li>`).join('')

controls.addEventListener('click', event => {
  const option = event.target.closest('[data-option]')
  if (!option) return
  const group = option.closest('[data-control]').dataset.control
  const value = option.dataset.option
  if (mode === 'scene') {
    const current = sceneAt(position)
    manual.actor = current.beat.actor
    manual.shot = current.beat.shot
    moods[current.beat.actor] = current.beat.mood
    moods[current.beat.actor === 'male' ? 'female' : 'male'] = current.beat.reaction
  }
  pause()
  mode = 'manual'
  if (group === 'outfit') wardrobe[manual.actor] = value
  else if (group === 'mood') moods[manual.actor] = value
  else manual[group] = value

  if (group === 'actor' && manual.shot === 'pair') manual.shot = 'close'
  if (group === 'gesture') gestureTime = performance.now()
  update()
})

function sceneAt(seconds) {
  let index = lineAudio.findLastIndex(line => seconds >= line.start)
  if (index < 0) index = 0
  const line = lineAudio[index]
  return { beat: beats[index], index, line, local: Math.max(0, seconds - line.start) }
}

function sampleVoice(line, time) {
  const point = time / timing.step
  const frame = Math.floor(point)
  const mix = point - frame
  const energy = (line.energy[frame] ?? 0) * (1 - mix) + (line.energy[frame + 1] ?? 0) * mix
  const clause = line.clauses.find(([start, end]) => time >= start && time < end)
  if (!clause || energy < .022) return silent
  const [start, end, pinyin] = clause
  const syllableTime = ((time - start) / (end - start)) * pinyin.length
  const word = pinyin[Math.min(pinyin.length - 1, Math.floor(syllableTime))]
  const local = syllableTime % 1
  const round = /(?:ong|uo|ou|ao|u|o|ü)/.test(word) ? .71 : /i/.test(word) ? .08 : .22
  const closure = /^[bmp]/.test(word) && local < .19 ? .18 + local * 3 : 1
  return { energy: energy * closure, round }
}

function view() {
  if (mode === 'manual') return { ...manual, mood: moods[manual.actor], moods, subtitle: false }
  const { beat, line, index, local } = sceneAt(position)
  const moodsForLine = beat.actor === 'male' ? { male: beat.mood, female: beat.reaction } : { male: beat.reaction, female: beat.mood }
  return {
    actor: beat.actor,
    backdrop: manual.backdrop,
    shot: beat.shot,
    gesture: beat.gesture,
    mood: beat.mood,
    moods: moodsForLine,
    subtitle: true,
    beat, line, index, local,
  }
}

function updateStage(state) {
  const { actor, shot, backdrop, mood, gesture, beat, index, subtitle } = state
  const key = [mode, actor, shot, backdrop, mood, gesture, wardrobe.male, wardrobe.female, index].join('/')
  if (key === displayedKey) return
  displayedKey = key
  stage.dataset.shot = shot
  stage.dataset.presentation = mode
  if (stage.dataset.backdrop !== backdrop || !stage.querySelector('.plate').style.backgroundImage) {
    stage.dataset.backdrop = backdrop
    stage.querySelector('.plate').style.backgroundImage = `url('${art(backdrop)}')`
  }
  stage.dataset.focus = actor
  byId('location').textContent = backdrops.find(([id]) => id === backdrop)[1]
  byId('shot-slate').textContent = shots.find(([id]) => id === shot)[1]

  for (const [id, rig] of Object.entries(actors)) {
    rig.outfit(wardrobe[id])
    rig.root.setAttribute('aria-hidden', String(shot !== 'pair' && id !== actor))
  }
  byId('subtitles').hidden = !subtitle || byId('subtitles-toggle').getAttribute('aria-pressed') === 'false'
  byId('speaker').textContent = beat ? cast[actor].name : ''
  byId('subtitle-zh').textContent = beat?.zh ?? ''
  byId('subtitle-en').textContent = beat?.en ?? ''
  for (const line of scriptList.querySelectorAll('button')) line.setAttribute('aria-current', String(Number(line.dataset.line) === index))
  if (loadedWardrobe !== actor) {
    loadedWardrobe = actor
    controls.querySelector('[data-control="outfit"] .control-options').innerHTML = cast[actor].wardrobe.map(option => optionMarkup('outfit', option)).join('')
  }
  const selected = { actor, shot, backdrop, mood, gesture: mode === 'preview' ? 'idle' : gesture, outfit: wardrobe[actor] }
  for (const [id, value] of Object.entries(selected)) {
    for (const choice of controls.querySelectorAll(`[data-control="${id}"] button`)) {
      choice.setAttribute('aria-pressed', String(choice.dataset.option === value))
    }
  }
}

function formatTime(position) {
  const seconds = Math.floor(position + .0001)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function updateTransport() {
  if (position !== transportPosition) {
    transportPosition = position
    seek.value = position
    seek.style.setProperty('--progress', `${(position / timing.duration) * 100}%`)
  }
  const label = `${formatTime(position)} / ${formatTime(timing.duration)}`
  const transportState = [mode, playing, audioAvailable, label].join('/')
  if (transportKey === transportState) return
  transportKey = transportState
  byId('time').textContent = label
  setIcon(byId('play').firstElementChild, playing ? 'pause' : 'play')
  byId('play').setAttribute('aria-label', playing ? '暂停' : '播放')
  byId('play').title = playing ? '暂停' : '播放'
  const premiere = byId('premiere')
  setIcon(premiere.firstElementChild, playing ? 'pause' : 'play')
  premiere.lastElementChild.textContent = playing ? '暂停短剧' : '播放短剧'
  byId('screen-state').textContent = playing ? (audioAvailable ? '正在放映' : '静音放映') : { manual: '手动调演', preview: '场景预览', scene: position >= timing.duration ? '放映结束' : '放映暂停' }[mode]
}

function update(now = performance.now()) {
  if (playing) {
    if (audioAvailable && mediaStarted) position = audio.ended ? timing.duration : audio.currentTime
    else if (!audioAvailable) position = fallbackPosition + (now - fallbackTime) / 1000
    if (position >= timing.duration) {
      position = timing.duration
      pause()
    }
  }
  const state = view()
  updateStage(state)
  updateTransport()
  const ambient = previewTime ?? ((now - startTime) / 1000)
  drawParticles(reduced.matches ? 0 : ambient, state.backdrop)
  for (const [id, rig] of Object.entries(actors)) {
    if (state.shot !== 'pair' && id !== state.actor) continue
    const focused = id === state.actor
    const local = mode === 'manual' ? Math.max(0, (now - gestureTime) / 1000) : state.local
    const voice = mode === 'scene' && focused ? sampleVoice(state.line, local) : silent
    const gesture = focused && mode !== 'preview' ? state.gesture : 'idle'
    rig.render({ time: local, mood: state.moods[id], idleTime: ambient, voice, gesture, motion: !reduced.matches })
  }
}

function pause() {
  playing = false
  playbackToken++
  audio.pause()
  mediaStarted = false
}

function skip(seconds) {
  position = Math.min(Math.max(seconds, 0), timing.duration)
  mode = 'scene'
  fallbackTime = performance.now()
  fallbackPosition = position
  if (audioAvailable) audio.currentTime = position
  if (position >= timing.duration) pause()
  update()
}

function loseAudio() {
  audioAvailable = false
  fallbackTime = performance.now()
  fallbackPosition = position
}

async function play(fromStart = false) {
  if (playing && !fromStart) {
    pause()
    update()
    return
  }
  if (fromStart || mode !== 'scene' || position >= timing.duration) skip(0)
  playing = true
  const token = ++playbackToken
  fallbackTime = performance.now()
  fallbackPosition = position
  update()
  if (audioAvailable) {
    try {
      audio.currentTime = position
      await audio.play()
      if (token === playbackToken) mediaStarted = true
    } catch {
      if (token === playbackToken) loseAudio()
    }
  }
}

audio.addEventListener('error', loseAudio)
audio.addEventListener('ended', () => {
  if (playing) {
    position = timing.duration
    pause()
    update()
  }
})

seek.max = timing.duration
seek.addEventListener('input', () => skip(Number(seek.value)))
byId('play').addEventListener('click', () => play())
byId('premiere').addEventListener('click', () => play())
byId('restart').addEventListener('click', () => play(true))
byId('sound').addEventListener('click', event => {
  const button = event.currentTarget
  audio.muted = !audio.muted
  button.setAttribute('aria-pressed', String(!audio.muted))
  setIcon(button.firstElementChild, audio.muted ? 'mute' : 'sound')
  button.lastElementChild.textContent = audio.muted ? '静音' : '原声'
})
byId('subtitles-toggle').addEventListener('click', event => {
  const button = event.currentTarget
  button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') === 'false'))
  displayedKey = ''
  update()
})
byId('fullscreen').disabled = !document.fullscreenEnabled
byId('fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await player.requestFullscreen()
  } catch (error) {
    console.warn('此浏览器无法进入全屏。', error)
  }
})
document.addEventListener('fullscreenchange', () => {
  const button = byId('fullscreen')
  const active = Boolean(document.fullscreenElement)
  setIcon(button.firstElementChild, active ? 'collapse' : 'expand')
  button.setAttribute('aria-label', active ? '退出全屏' : '全屏')
  button.title = active ? '退出全屏' : '全屏'
})
for (const button of document.querySelectorAll('[data-view]')) {
  button.addEventListener('click', () => {
    const script = button.dataset.view === 'script'
    byId('script-view').hidden = !script
    byId('studio-view').hidden = script
    for (const tab of document.querySelectorAll('[data-view]')) {
      tab.classList.toggle('active', tab === button)
      tab.setAttribute('aria-pressed', String(tab === button))
    }
  })
}
scriptList.addEventListener('click', event => {
  const button = event.target.closest('[data-line]')
  if (button) {
    skip(lineAudio[Number(button.dataset.line)].start)
    if (!playing) play()
  }
})

seek.value = 0
update()
requestAnimationFrame(function tick(time) {
  update(time)
  requestAnimationFrame(tick)
})

if (new URLSearchParams(location.search).has('capture')) {
  window.__manhua = {
    timing,
    get position() { return position },
    get duration() { return timing.duration },
    get playing() { return playing },
    get media() { return { position: audio.currentTime, available: audioAvailable, started: mediaStarted, muted: audio.muted } },
    freeze(ambient) { previewTime = ambient; update() },
  }
}
