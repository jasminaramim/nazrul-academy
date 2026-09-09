const bengaliDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '০';
  const str = typeof num === 'number' ? num.toLocaleString('en-US') : String(num);
  return str.replace(/[0-9]/g, (w) => bengaliDigits[w] || w);
}

export function formatTaka(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '৳ ০';
  return `৳ ${toBengaliNumber(amount)}`;
}

export function formatDateBengali(dateStr: string): string {
  if (!dateStr) return '';
  return toBengaliNumber(dateStr);
}
