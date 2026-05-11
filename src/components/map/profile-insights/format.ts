export function formatCompactCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000
    const s = k >= 10 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, '')
    return `${s}K`
  }
  return new Intl.NumberFormat('he-IL').format(n)
}

export function formatFullCount(n: number): string {
  return new Intl.NumberFormat('he-IL').format(n)
}
