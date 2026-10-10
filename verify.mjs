import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const root = 'dist'
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png',
}
const server = http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0])
  if (p === '/') p = '/index.html'
  fs.readFile(path.join(root, p), (e, d) => {
    if (e) { res.writeHead(404); res.end('nf'); return }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' })
    res.end(d)
  })
})
await new Promise((r) => server.listen(4321, r))

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/chromium-headless-shell',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
page.setDefaultTimeout(15000)
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })

const shots = 'shots'
fs.rmSync(shots, { recursive: true, force: true })
fs.mkdirSync(shots, { recursive: true })
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errors.push('CONSOLE: ' + m.text()) })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function shot(name) { await wait(700); await page.screenshot({ path: path.join(shots, name + '.png') }) }
async function clickText(...txts) {
  const ok = await page.evaluate((arr) => {
    const els = [...document.querySelectorAll('button')]
    for (const t of arr) {
      const el = els.find((e) => (e.textContent || '').trim().toLowerCase().includes(t.toLowerCase()))
      if (el) { el.click(); return t }
    }
    return null
  }, txts)
  if (!ok) errors.push('click not found: ' + txts.join(' | '))
  await wait(500)
  return ok
}
async function jump(i) {
  await page.evaluate((idx) => {
    const s = JSON.parse(localStorage.getItem('happy20.v1') || '{}')
    s.sceneIndex = idx; s.unlocked = true
    localStorage.setItem('happy20.v1', JSON.stringify(s))
  }, i)
  await page.reload({ waitUntil: 'networkidle2' })
  await wait(400)
}

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle2' })
await shot('01-invitation')
await clickText("It's time"); await shot('02-password')
await page.focus('input'); await page.type('input', '2000')
await clickText('Unlock'); await shot('03-unlocked')
await wait(1400); await shot('04-delivery')
await clickText('Continue'); await clickText('Continue'); await clickText('Continue')
await clickText('Take the parcel'); await shot('05-unwrap')
await page.evaluate(() => document.querySelector('[aria-label="Unwrap the parcel"]')?.click())
await shot('06-magazine')
await clickText('Open it'); await shot('07-balloons')
await wait(3200); await shot('08-cake')
await clickText('tap here to blow', 'Blow the candles')
await clickText('tap here to blow', 'Blow the candles')
await clickText('tap here to blow', 'Blow the candles')
await shot('09-candles-blown')
await clickText('Wish made'); await shot('10-applause')
await clickText('Show me the gifts'); await shot('11-gifts')
await clickText('The Jar of Stars'); await shot('12-gift-jar')
await page.evaluate(() => document.querySelector('[aria-label="Close"]')?.click())
await wait(400)
await clickText('Skip to the end'); await shot('13-reveal-choice')
await clickText('Play alone'); await wait(500); await shot('14-reveal-board')
// play the game out
for (let round = 0; round < 2; round++) {
  for (const n of [5, 1, 3, 7, 9, 2, 4, 6, 8]) {
    await page.evaluate((c) => document.querySelector(`[aria-label="Cell ${c}"]`)?.click(), n)
    await wait(700)
  }
}
await wait(1600); await shot('15-reveal-card')

await jump(8); await shot('16-notes')
await jump(9); await shot('17-close')
await clickText('Tie it closed'); await wait(1500); await shot('18-close-tied')
await jump(10); await shot('19-keepsake')

console.log('SHOTS:', fs.readdirSync(shots).length)
console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
await browser.close()
server.close()
