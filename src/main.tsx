import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import content from './content.json'

// A generated page carries its own content object; when present it overrides
// the bundled defaults. This is how the builder's exported pages work.
const override = (window as any).__BIRTHDAY_CONTENT__
if (override) Object.assign(content, override)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
