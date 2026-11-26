// 1234 → "1,234" | বড় সংখ্যা → "1.2K"
export function formatNumber(n) {
  const num = Number(n) || 0;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return num.toLocaleString('en-US');
}

export function normalizeAvailableGroups(value) {
  const groups = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/[|,]/)
      : [];

  return groups
    .filter((group) => typeof group === 'string')
    .map((group) => group.trim())
    .filter(Boolean);
}

export function toDisplayText(value) {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '';
}

export function formatContactNumber(value) {
  const contactNumber = toDisplayText(value).trim();
  if (!contactNumber) return '';

  const digits = contactNumber.replace(/\D/g, '');
  return /^1\d{9}$/.test(digits) ? `0${digits}` : contactNumber;
}