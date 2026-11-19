// 1234 → "1,234" | বড় সংখ্যা → "1.2K"
export function formatNumber(n) {
  const num = Number(n) || 0;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return num.toLocaleString('en-US');
}