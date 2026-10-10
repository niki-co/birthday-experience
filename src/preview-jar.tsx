import { createRoot } from 'react-dom/client'
import Jar from './components/Jar'
import type { Star } from './components/Jar'

// Sample stars, so the jar looks alive. These are placeholders — the real ones
// go in src/content.json under the "jar" gift.
const SAMPLE: Star[] = [
  { type: 'note', text: 'You are, objectively, the best thing this family has ever produced. Sorry to everyone else.' },
  { type: 'wish', text: 'May you always find money in old jacket pockets.' },
  { type: 'dare', text: 'DARE: send me the last photo in your camera roll. No deleting first.' },
  { type: 'note', text: 'Remember the wedding? You danced like nobody was watching. Nobody was. It was glorious.' },
  { type: 'photo', src: '' },
  { type: 'wish', text: 'May your chai always be exactly the right temperature.' },
  { type: 'dare', text: 'DARE: do your best impression of me, right now, out loud.' },
  { type: 'note', text: 'The way you laugh at your own jokes before you finish them — never change that.' },
  { type: 'wish', text: 'May every queue you ever join be the fast one.' },
  { type: 'dare', text: 'DARE: text Dad a single random emoji and say nothing else.' },
  { type: 'note', text: 'Twenty stars for twenty years. This is star one of the whole night.' },
  { type: 'photo', src: '' },
  { type: 'wish', text: 'May you always be somebody’s favourite person. (You already are.)' },
  { type: 'note', text: 'If you ever forget how loved you are, come back and open this jar again.' },
]

function Preview() {
  return (
    <div className="stage">
      <div className="wrap flex flex-col items-center text-center gap-4">
        <p className="eyebrow">Gift one</p>
        <h1 className="display text-4xl text-cream">The Jar of Stars</h1>
        <Jar stars={SAMPLE} from="[You]" />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
