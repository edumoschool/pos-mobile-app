/**
 * Formats a number or string with thousands separators (commas).
 * Example: 1000000 -> 1,000,000
 */
export const formatAmount = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '';
  
  // Strip all non-numeric characters except the first decimal point
  let str = typeof val === 'number' ? val.toString() : val.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const firstDecimal = str.indexOf('.');
  if (firstDecimal !== -1) {
    str = str.slice(0, firstDecimal + 1) + str.slice(firstDecimal + 1).replace(/\./g, '');
  }

  if (str === '') return '';
  
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return parts.join('.');
};
