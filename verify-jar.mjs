import puppeteer from 'puppeteer-core'
import path from 'node:path'
import fs from 'node:fs'

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/chromium-headless-shell',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const errs = []
page.on('pageerror', (e) => errs.push(e.message))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

fs.mkdirSync('shots', { recursive: true })
await page.goto('file://' + path.resolve('/scratch/output/Jar-Gift-Preview.html'), { waitUntil: 'load' })
await wait(1200)
await page.screenshot({ path: 'shots/jar-01.png' })

await page.evaluate(() => document.querySelector('[aria-label="Star 1"]')?.click())
await wait(900)
await page.screenshot({ path: 'shots/jar-02-note.png' })

await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((e) => e.textContent.includes('Fold it back'))
  b?.click()
})
await wait(500)
await page.evaluate(() => document.querySelector('[aria-label="Star 3"]')?.click())
await wait(900)
await page.screenshot({ path: 'shots/jar-03-dare.png' })

console.log('errors:', errs.length ? errs.join('; ') : 'none')
await browser.close()
