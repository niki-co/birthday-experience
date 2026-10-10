// Builds ONE self-contained HTML file (JS + CSS inlined) so the whole
// experience can be opened directly, with no server.
import { build } from 'esbuild'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import fs from 'node:fs'

const css = await postcss([tailwind()]).process(
  fs.readFileSync('src/index.css', 'utf8'),
  { from: 'src/index.css' },
)

const res = await build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  format: 'iife',
  jsx: 'automatic',
  minify: true,
  target: 'esnext',
  write: false,
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.webp': 'dataurl' },
})
const js = res.outputFiles[0].text

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#120d18" />
<title>Birthday Experience</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300..700&family=Caveat:wght@400..700&family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet" />
<style>${css.css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`
fs.mkdirSync('dist', { recursive: true })
fs.writeFileSync('dist/index.html', html)
console.log('single file written:', (html.length / 1024).toFixed(0), 'KB')
