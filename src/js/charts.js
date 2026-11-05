// Chart.js charts, loaded only when a [data-chart] element approaches the viewport.
// Palette (validated with the dataviz checker against white):
//   single series  #20659F
//   two series     #20659F, #5FB3E3   (ΔE 24, CVD-safe)
// Rules: one y-axis, hairline solid grid, 2px lines, ≤24px bars with 4px rounded ends,
// tooltips on hover, text in ink tokens (never series colour).
import {
  Chart, BarController, BarElement, LineController, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Filler,
} from 'chart.js'
import { reduced } from './motion.js'
import { sampleCompany } from '../data/sample-company.js'
import { landscape } from '../data/landscape.js'

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler)

const C1 = '#20659F'
const C2 = '#5FB3E3'
const INK = '#0F1E2E'
const MUTED = '#4A5866'
const GRID = '#E6EDF3'

Chart.defaults.font.family = '"Inter Variable", system-ui, sans-serif'
Chart.defaults.font.size = 12
Chart.defaults.color = MUTED
Chart.defaults.animation = reduced ? false : { duration: 900, easing: 'easeOutQuart' }
Chart.defaults.maintainAspectRatio = false

const tooltip = {
  backgroundColor: '#fff',
  titleColor: INK,
  bodyColor: INK,
  borderColor: '#DCE6EF',
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  boxPadding: 4,
  usePointStyle: true,
  titleFont: { weight: '600' },
  bodyFont: { family: '"Inter Variable", system-ui, sans-serif', size: 12 },
}

function axes({ yFmt = (v) => v, horizontal = false } = {}) {
  const valueAxis = {
    beginAtZero: true,
    border: { display: false },
    grid: { color: GRID, lineWidth: 1, drawTicks: false },
    ticks: { padding: 8, maxTicksLimit: 5, callback: yFmt, font: { family: '"Inter Variable"', size: 12 } },
  }
  const catAxis = { grid: { display: false }, border: { color: '#C4D3E1' }, ticks: { padding: 6, color: MUTED } }
  return horizontal ? { x: valueAxis, y: catAxis } : { x: catAxis, y: valueAxis }
}

// Direct label on one chosen bar/point (selective labelling — never every point)
const endLabel = {
  id: 'endLabel',
  afterDatasetsDraw(chart, _args, opts) {
    if (!opts || opts.index == null) return
    const { ctx } = chart
    const meta = chart.getDatasetMeta(opts.dataset || 0)
    const el = meta.data[opts.index === -1 ? meta.data.length - 1 : opts.index]
    if (!el) return
    const value = chart.data.datasets[opts.dataset || 0].data[opts.index === -1 ? meta.data.length - 1 : opts.index]
    ctx.save()
    ctx.font = '600 12px "Inter Variable", system-ui, sans-serif'
    ctx.fillStyle = INK
    if (opts.horizontal) {
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.fillText(opts.format(value), el.x + 6, el.y)
    } else {
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
      ctx.fillText(opts.format(value), el.x, el.y - 6)
    }
    ctx.restore()
  },
}

const bar = (color) => ({
  backgroundColor: color,
  hoverBackgroundColor: '#155586',
  borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
  borderSkipped: 'bottom',
  maxBarThickness: 24,
})
const hbar = (color) => ({
  ...bar(color),
  borderRadius: { topRight: 4, bottomRight: 4, topLeft: 0, bottomLeft: 0 },
  borderSkipped: 'left',
  maxBarThickness: 18,
})
const line = (color, fill = false) => ({
  borderColor: color,
  backgroundColor: fill ? 'rgba(32,101,159,0.10)' : color,
  fill,
  borderWidth: 2,
  tension: 0.25,
  pointRadius: 4,
  pointHoverRadius: 6,
  pointBackgroundColor: color,
  pointBorderColor: '#fff',
  pointBorderWidth: 2,
  pointHitRadius: 14,
})

const S = sampleCompany
const builders = {
  revenue: () => ({
    type: 'bar',
    data: { labels: S.years, datasets: [{ label: 'Revenue', data: S.financials.revenue, ...bar(C1) }] },
    options: {
      layout: { padding: { top: 20, right: 22 } },
      scales: axes({ yFmt: (v) => `${v}` }),
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltip, callbacks: { label: (c) => ` Revenue ${c.parsed.y} m` } },
        endLabel: { index: -1, format: (v) => `${v} m` },
      },
    },
  }),
  networth: () => ({
    type: 'line',
    data: {
      labels: S.years,
      datasets: [
        { label: 'Net worth', data: S.financials.netWorth, ...line(C1) },
        { label: 'Borrowings', data: S.financials.borrowings, ...line(C2) },
      ],
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      scales: axes({ yFmt: (v) => `${v}` }),
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: (c) => ` ${c.dataset.label} ${c.parsed.y} m` } } },
    },
  }),
  states: () => ({
    type: 'bar',
    data: { labels: landscape.states.map((d) => d.label), datasets: [{ label: 'Share of active companies', data: landscape.states.map((d) => d.value), ...hbar(C1) }] },
    options: {
      indexAxis: 'y',
      layout: { padding: { right: 36 } },
      scales: axes({ yFmt: (v) => `${v}%`, horizontal: true }),
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltip, callbacks: { label: (c) => ` ${c.parsed.x}% of active companies` } },
        endLabel: { index: 0, horizontal: true, format: (v) => `${v}%` },
      },
    },
  }),
  capital: () => ({
    type: 'bar',
    data: { labels: landscape.capital.map((d) => d.label), datasets: [{ label: 'Share of companies', data: landscape.capital.map((d) => d.value), ...bar(C1) }] },
    options: {
      layout: { padding: { top: 20 } },
      scales: axes({ yFmt: (v) => `${v}%` }),
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: (c) => ` ${c.parsed.y}% of companies` } } },
    },
  }),
  registrations: () => ({
    type: 'line',
    data: { labels: landscape.registrations.map((d) => d.label), datasets: [{ label: 'New companies registered', data: landscape.registrations.map((d) => d.value), ...line(C1, true) }] },
    options: {
      interaction: { mode: 'index', intersect: false },
      layout: { padding: { top: 20, right: 30 } },
      scales: axes({ yFmt: (v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : v) }),
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltip, callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString('en-IN')} new companies` } },
        endLabel: { index: -1, format: (v) => v.toLocaleString('en-IN') },
      },
    },
  }),
}

export function renderChart(el) {
  const build = builders[el.dataset.chart]
  if (!build || el.dataset.rendered) return
  // A canvas inside a hidden tab panel has no size yet: wait until its panel is shown.
  if (!el.offsetParent) {
    const panel = el.closest('[role="tabpanel"]')
    panel?.addEventListener('tabshow', () => renderChart(el), { once: true })
    return
  }
  el.dataset.rendered = 'true'
  const cfg = build()
  cfg.plugins = [endLabel]
  new Chart(el, cfg)
}
