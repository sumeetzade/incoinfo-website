// Credit packs. 1 credit = 1 company unlock (full report + PDF/Excel + 12 months of filing updates).
// Prices in ₹, excluding GST. TODO: confirm single-company price before launch.
export const singlePrice = 599 // pay-as-you-go, one company

export const packs = [
  { id: 'starter', name: 'Starter', credits: 10, price: 5500 },
  { id: 'basic', name: 'Basic', credits: 25, price: 12500 },
  { id: 'professional', name: 'Professional', credits: 100, price: 45000 },
  { id: 'business', name: 'Business', credits: 250, price: 100000 },
  { id: 'corporate', name: 'Corporate', credits: 500, price: 175000 },
  { id: 'enterprise', name: 'Enterprise', credits: 1000, price: 300000 },
]

const single = { id: 'single', name: 'Single company', credits: 1, price: singlePrice }

/**
 * Cheapest mix of packs (and single-company purchases) that covers `n` companies.
 * Ties go to fewer spare credits, then fewer purchases.
 * Returns { items: [{ pack, qty }], total, credits, perCompany, spare, main } where `main` is the
 * largest pack in the mix (used to highlight its card).
 */
export function recommend(n) {
  const options = [single, ...packs]
  const limit = n + Math.max(...packs.map((p) => p.credits))
  const cost = new Array(limit + 1).fill(Infinity)
  const count = new Array(limit + 1).fill(Infinity)
  const pick = new Array(limit + 1).fill(-1)
  cost[0] = 0
  count[0] = 0
  for (let c = 1; c <= limit; c++) {
    options.forEach((o, i) => {
      if (o.credits > c) return
      const k = cost[c - o.credits] + o.price
      const m = count[c - o.credits] + 1
      if (k < cost[c] || (k === cost[c] && m < count[c])) { cost[c] = k; count[c] = m; pick[c] = i }
    })
  }
  let best = n
  for (let c = n; c <= limit; c++) {
    if (cost[c] < cost[best] || (cost[c] === cost[best] && count[c] < count[best])) best = c
  }
  const qty = new Map()
  for (let c = best; c > 0; c -= options[pick[c]].credits) {
    const o = options[pick[c]]
    qty.set(o, (qty.get(o) || 0) + 1)
  }
  const items = [...qty].map(([pack, q]) => ({ pack, qty: q })).sort((a, b) => b.pack.credits - a.pack.credits)
  return {
    items,
    total: cost[best],
    credits: best,
    perCompany: cost[best] / n,
    spare: best - n,
    main: items[0].pack.id,
  }
}
