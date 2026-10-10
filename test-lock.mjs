import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }
const server = http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0])
  if (p === '/') p = '/index.html'
  fs.readFile(path.join('dist', p), (e, d) => {
    if (e) { res.writeHead(404); res.end('nf'); return }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' })
    res.end(d)
  })
})
await new Promise((r) => server.listen(4322, r))

const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/chromium-headless-shell',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})

async function probe(label, url, h = 844) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 390, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.goto(url, { waitUntil: 'load' })
  await new Promise((r) => setTimeout(r, 1800))
  const info = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((e) => /open it/i.test(e.textContent || ''))
    const r = b ? b.getBoundingClientRect() : null
    const st = document.querySelector('.stage')
    return {
      buttons: [...document.querySelectorAll('button')].map((x) => x.textContent.trim()).filter(Boolean),
      btnTop: r ? Math.round(r.top) : null,
      btnBottom: r ? Math.round(r.bottom) : null,
      innerH: window.innerHeight,
      scrollH: st ? st.scrollHeight : 0,
      canScroll: st ? st.scrollHeight > window.innerHeight + 2 : false,
      text: (document.body.innerText || '').slice(0, 120).replace(/\n+/g, ' | '),
    }
  })
  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((e) => /open it/i.test(e.textContent || ''))
    if (b) { b.click(); return true }
    return false
  })
  await new Promise((r) => setTimeout(r, 1000))
  const after = await page.evaluate(() => (document.body.innerText || '').slice(0, 160).replace(/\n+/g, ' | '))
  console.log(`\n===== ${label} =====`)
  console.log('buttons:', JSON.stringify(info.buttons))
  console.log('btn top/bottom:', info.btnTop, '/', info.btnBottom, '| viewport h:', info.innerH, '| stage scrollH:', info.scrollH, '| canScroll:', info.canScroll)
  console.log('text   :', info.text)
  console.log('clicked "open it":', clicked)
  console.log('after click:', after)
  console.log('errors :', errs.length ? errs.join('; ') : 'none')
  await context.close()
}

await probe('SERVED dist (390x844)', 'http://localhost:4322/', 844)
await probe('SERVED dist (360x640 small)', 'http://localhost:4322/', 640)
await probe('SINGLE FILE', 'file://' + path.resolve('dist/[Name]-Birthday.html'), 844)

await browser.close()
server.close()
