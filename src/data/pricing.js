// Credit packs. 1 credit = 1 company unlock (full report + PDF/Excel + 12 months of filing updates).
// TODO: all prices are placeholders — confirm before launch. Prices exclude GST.
export const singlePrice = 599 // pay-as-you-go, one company

export const packs = [
  { id: 'starter', name: 'Starter', credits: 10, price: 4990 },
  { id: 'growth', name: 'Growth', credits: 50, price: 19990 },
  { id: 'enterprise', name: 'Enterprise', credits: 200, price: 59990 },
]

/** Cheapest way to cover `n` companies with whole packs, a single pack type, or pay-as-you-go. */
export function recommend(n) {
  const options = [
    { id: 'single', label: 'Pay as you go', qty: n, total: n * singlePrice, credits: n },
    ...packs.map((p) => {
      const qty = Math.ceil(n / p.credits)
      return { id: p.id, label: `${p.name} pack`, qty, total: qty * p.price, credits: qty * p.credits }
    }),
  ]
  options.sort((a, b) => a.total - b.total || a.credits - b.credits)
  const best = options[0]
  return { ...best, perCompany: best.total / n, spare: best.credits - n }
}
