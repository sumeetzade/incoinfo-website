// "How it works": a progress line fills as the reader scrolls through the steps,
// and each step marker lights when the line reaches it.
import { reduced } from './motion.js'

export default async function initSteps(list) {
  const steps = [...list.querySelectorAll('.step')]
  const setProgress = (p) => {
    list.style.setProperty('--p', p.toFixed(3))
    steps.forEach((s, i) => s.classList.toggle('is-active', p >= i / Math.max(1, steps.length - 1) - 0.02))
  }
  if (reduced) return setProgress(1)

  setProgress(0)
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.create({
    trigger: list,
    start: 'top 78%',
    end: 'bottom 52%',
    scrub: 0.4,
    onUpdate: (self) => setProgress(self.progress),
  })
}
