// Sample report: assembles itself the first time it scrolls into view;
// each newly opened tab re-runs a shorter build for its own rows.
import { onVisible, reduced } from './motion.js'

export default function initReport(report) {
  report.querySelectorAll('.report-panel').forEach((panel) => {
    panel.querySelectorAll('[data-build]').forEach((el, i) => el.style.setProperty('--b', String(Math.min(i, 12))))
  })
  if (reduced) {
    report.classList.add('is-built')
    return
  }
  onVisible(report, () => report.classList.add('is-built'), { rootMargin: '0px 0px -20% 0px', threshold: 0.2 })

  report.addEventListener('tabshow', (e) => {
    const panel = e.target
    if (!report.classList.contains('is-built')) return
    panel.classList.remove('is-entering')
    void panel.offsetWidth // restart animation
    panel.classList.add('is-entering')
  })
}
