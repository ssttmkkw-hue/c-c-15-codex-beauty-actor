import assert from 'node:assert/strict'
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/workspace/pwtool/node_modules/playwright')
const url = new URL(process.env.SHOTS_URL || 'http://127.0.0.1:5815/')
url.searchParams.set('capture', '')
const out = process.env.SHOTS_DIR || '/workspace/codex-beauty-shots'
const prefix = process.env.SHOTS_PREFIX || 'r3-'
const flags = ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
const browser = await chromium.launch({ headless: true, args: flags })
const errors = []
const motions = ['neutral', 'smile', 'shy', 'sad', 'angry', 'surprised']
const wardrobes = { male: ['ink', 'ivory', 'wine'], female: ['blush', 'nocturne', 'jade'] }

await mkdir(out, { recursive: true })

async function openPage(viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion })
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', entry => { if (entry.type() === 'error' || entry.type() === 'warning') errors.push(entry.text()) })
  page.on('requestfailed', request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`${request.url()} ${request.failure()?.errorText}`)
  })
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
  await page.goto(url.href, { waitUntil: 'load' })
  await page.waitForFunction(() => window.__manhua)
  await page.evaluate(async () => {
    await document.fonts.ready
    const face = ['male', 'female'].flatMap(actor => [
      ...['angry', 'surprised', 'blink', 'smile', 'sad'].map(mood => `${actor}-eyes-${mood}`),
      ...['smile', 'sad'].map(mood => `${actor}-mouth-${mood}`),
    ])
    const stage = ['roof', 'night', 'rooftop-reverse', 'train-ticket']
    await Promise.all(['ink', 'ivory', 'wine', 'blush', 'nocturne', 'jade', ...stage, 'male-eyes-partner', ...face].map(async name => {
      const image = new Image()
      image.src = new URL(`art/${name}.webp`, location.href)
      await image.decode()
    }))
  })
  return page
}

function choice(page, group, value) {
  return page.locator(`[data-control="${group}"] [data-option="${value}"]`)
}

async function select(page, group, value) {
  const button = choice(page, group, value)
  await button.click()
  assert.equal(await button.getAttribute('aria-pressed'), 'true')
  await page.waitForTimeout(520)
}

async function shot(page, label, stageOnly = true) {
  const destination = path.join(out, `${prefix}${label}.png`)
  if (stageOnly) await page.locator('#stage').screenshot({ path: destination })
  else await page.screenshot({ path: destination, fullPage: true })
}

async function seekTo(page, seconds) {
  await page.locator('#seek').evaluate((input, value) => {
    input.value = String(value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, seconds)
}

const measureFps = page => page.evaluate(() => window.__manhua.measureFps())

try {
  const page = await openPage({ width: 1440, height: 960 })
  await page.evaluate(() => window.__manhua.freeze(.65))
  assert.equal(await page.locator('#stage').getAttribute('data-cutaway'), 'closing')
  await page.locator('.costume-sample').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  await shot(page, 'panel', false)
  await shot(page, 'two-shot')
  await seekTo(page, .76)
  assert.equal(await page.locator('[data-actor="male"] .eye-partner').getAttribute('opacity'), '1')
  await shot(page, 'two-shot-live')

  for (const [actor, outfits] of Object.entries(wardrobes)) {
    await select(page, 'actor', actor)
    await select(page, 'shot', 'close')
    await select(page, 'mood', 'neutral')
    await shot(page, `close-${actor}`)
    if (actor === 'female') {
      await page.evaluate(() => window.__manhua.freeze(1.45))
      assert.equal(await page.locator('[data-actor="female"] .eye-blink').getAttribute('opacity'), '1')
      await shot(page, 'blink-female')
      await page.evaluate(() => window.__manhua.freeze(.65))
    }
    for (const mood of motions.slice(1)) {
      await select(page, 'mood', mood)
      const rig = page.locator(`.actor[data-actor="${actor}"]`)
      assert.equal(await rig.getAttribute('data-mood'), mood)
      if (mood === 'smile' || mood === 'sad') {
        assert.equal(await rig.locator(`.eye-${mood}`).getAttribute('opacity'), '1')
        assert.equal(await rig.locator(`.mouth-${mood}`).getAttribute('opacity'), '1')
      }
      await shot(page, `expression-${actor}-${mood}`)
    }
    await select(page, 'mood', 'neutral')
    await select(page, 'shot', 'three')
    for (const outfit of outfits) {
      await select(page, 'outfit', outfit)
      await shot(page, `outfit-${actor}-${outfit}`)
    }
    await select(page, 'outfit', outfits[0])
  }

  await select(page, 'backdrop', 'night')
  await select(page, 'shot', 'pair')
  await shot(page, 'rain-street')
  await select(page, 'shot', 'close')
  await shot(page, 'rain-close-female')
  await select(page, 'backdrop', 'roof')

  const rig = page.locator('.actor[data-actor="female"] .actor-body')
  const still = await rig.evaluate(node => node.style.transform)
  await choice(page, 'gesture', 'nod').click()
  await page.waitForTimeout(210)
  assert.notEqual(await rig.evaluate(node => node.style.transform), still)

  await page.locator('#subtitles-toggle').click()
  await seekTo(page, 0)
  assert.equal(await page.locator('#subtitles').isVisible(), false)
  await page.locator('#subtitles-toggle').click()
  assert.equal(await page.locator('#subtitles').isVisible(), true)
  assert.equal(await page.locator('#stage').getAttribute('data-shot'), 'pair')

  const first = await page.evaluate(() => window.__manhua.timing.lines[0])
  const timestamps = first.clauses.flatMap(([from, to]) => Array.from({ length: 4 }, (_, i) => from + ((i + .5) / 4) * (to - from)))
  const opening = page.locator('.actor[data-actor="male"] .mouth-opening')
  const visemes = new Set()
  for (const [i, seconds] of timestamps.entries()) {
    await seekTo(page, seconds)
    visemes.add(await opening.getAttribute('d'))
    assert.equal(await page.locator('#subtitle-zh').innerText(), i < 4 ? '你说等风，' : '是在等我吗？')
    await shot(page, `line-01-frame-${String(i + 1).padStart(2, '0')}`)
  }
  assert.ok(visemes.size >= 6, `Expected 6 distinct mouth shapes, got ${visemes.size}`)
  const sampledAt = await page.evaluate(() => window.__manhua.position)
  await select(page, 'mood', 'smile')
  assert.equal(await page.locator('#subtitles').isVisible(), false)
  await page.locator('#return-to-scene').click()
  assert.equal(await page.evaluate(() => window.__manhua.position), sampledAt)
  assert.equal(await page.locator('#subtitles').isVisible(), true)
  assert.equal(await page.locator('#play').evaluate(button => button === document.activeElement), true)

  await seekTo(page, (await page.evaluate(() => window.__manhua.timing.lines[1].start)) + 2.13)
  assert.match(await page.locator('#subtitle-zh').innerText(), /你怎么才来/)
  assert.equal(await page.locator('#stage').getAttribute('data-camera'), 'reverse')
  assert.equal(await page.locator('[data-actor="male"]').getAttribute('data-framing'), 'foreground')
  await shot(page, 'scene-what-took-you-so-long')

  await page.locator('[data-view="script"]').click()
  assert.equal(await page.locator('#script-lines button').count(), 6)
  await page.locator('#script-lines button').nth(1).click()
  await page.waitForFunction(() => window.__manhua.media.started && window.__manhua.position > window.__manhua.timing.lines[1].start + .12)
  assert.match(await page.locator('#subtitle-zh').innerText(), /我明天就走了/)
  await page.locator('#play').click()
  const pausedAt = await page.evaluate(() => window.__manhua.position)
  await page.waitForTimeout(240)
  assert.equal(await page.evaluate(() => window.__manhua.position), pausedAt)

  await page.locator('#sound').click()
  assert.equal(await page.evaluate(() => window.__manhua.media.muted), true)
  await seekTo(page, (await page.evaluate(() => window.__manhua.timing.lines[2].start)) + 3.32)
  assert.equal(await page.locator('#subtitle-zh').innerText(), '只剩一句想见你。')
  assert.equal(await page.locator('[data-actor="female"]').getAttribute('data-framing'), 'foreground')
  await shot(page, 'scene-the-confession')
  await seekTo(page, (await page.evaluate(() => window.__manhua.timing.lines[4].start)) + 2.72)
  assert.match(await page.locator('#subtitle-zh').innerText(), /同一班的车票/)
  assert.equal(await page.locator('#stage').getAttribute('data-cutaway'), 'ticket')
  await shot(page, 'scene-the-train-ticket')
  await page.evaluate(() => window.__manhua.seek(22.2))
  assert.equal(await page.locator('#stage').getAttribute('data-cutaway'), 'closing')
  assert.equal(await page.locator('#subtitles').isVisible(), false)
  await shot(page, 'scene-closing-look')
  await page.locator('[data-view="studio"]').click()
  await page.evaluate(() => window.__manhua.freeze(undefined))
  await page.locator('#restart').click()
  await page.waitForFunction(() => window.__manhua.media.started)
  const rooftopFps = await measureFps(page)
  assert.ok(await page.evaluate(() => window.__manhua.position > 4.8))
  assert.ok(await page.evaluate(() => Math.abs(window.__manhua.media.position - window.__manhua.position) < .1))

  const end = await page.evaluate(() => window.__manhua.duration)
  await seekTo(page, end - .35)
  await page.waitForFunction(() => !window.__manhua.playing && window.__manhua.position === window.__manhua.duration)
  assert.equal(await page.locator('#screen-state').innerText(), '放映结束')

  await select(page, 'backdrop', 'night')
  await page.locator('#restart').click()
  await page.waitForFunction(() => window.__manhua.media.started)
  const rainFps = await measureFps(page)
  await page.locator('#play').click()
  await page.evaluate(() => window.__manhua.seek(22.2))
  assert.equal(await page.locator('#stage').getAttribute('data-cutaway'), '')

  const mobile = await openPage({ width: 390, height: 844 }, 'reduce')
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth), 390)
  await shot(mobile, 'mobile', false)
  await mobile.evaluate(() => window.__manhua.seek(2.01))
  assert.equal(await mobile.locator('#subtitle-zh').innerText(), '是在等我吗？')
  await shot(mobile, 'mobile-dialogue')
  await select(mobile, 'actor', 'female')
  await select(mobile, 'outfit', 'jade')
  assert.equal(await mobile.locator('[data-actor="female"]').getAttribute('data-outfit'), 'jade')
  await mobile.evaluate(() => window.__manhua.seek(22.2))
  assert.equal(await mobile.locator('#stage').getAttribute('data-cutaway'), '')
  assert.equal(await mobile.evaluate(() => window.__manhua.choose('outfit', 'blush')), true)
  assert.equal(await mobile.evaluate(() => window.__manhua.choose('outfit', 'ink')), false)
  await mobile.evaluate(() => window.__manhua.seek(22.2))
  assert.equal(await mobile.locator('#stage').getAttribute('data-cutaway'), 'closing')

  assert.deepEqual(errors, [])
  if (prefix === 'r3-') {
    const best = ['panel', 'two-shot', 'close-male', 'close-female', 'rain-street', 'expression-female-sad', 'scene-the-train-ticket']
    await Promise.all(best.map(label => copyFile(path.join(out, `${prefix}${label}.png`), path.join(out, `best-${label}.png`))))
  }
  console.log(JSON.stringify({ viewport: '1440×960', renderer: 'Chromium with SwiftShader flags (software GL)', rooftopFps, rainFps, distinctMouthShapes: visemes.size }, null, 2))
} finally {
  await browser.close()
}
