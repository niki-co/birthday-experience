import puppeteer from 'puppeteer-core'
import path from 'node:path'

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/chromium-headless-shell',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true })
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

const file = 'file://' + path.resolve('dist/[Name]-Birthday.html')
await page.goto(file, { waitUntil: 'load' })
await new Promise((r) => setTimeout(r, 1200))
const text = await page.evaluate(() => document.body.innerText.slice(0, 200))
await page.screenshot({ path: 'shots/single-file.png' })
console.log('rendered text:', JSON.stringify(text))
console.log('errors:', errors.length ? errors.join('; ') : 'none')
await browser.close()
