export const sanitizeText = (value: unknown): string => {
  return typeof value === 'string' ? value.replace(/[<>]/g, '').trim() : '';
};

export const sanitizeNumber = (value: unknown): number => {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(num) && num >= 0 ? num : 0;
};
