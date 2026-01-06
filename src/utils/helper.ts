import { Nullable } from '../types';

export const formatDate = (date?: string | Date | null): string => {
  if (!date) return 'NA';

  const d = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(d.getTime())) return 'NA';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const safe = (v: Nullable<string | number>): string => {
  return String(v ?? 'NA');
};

export const format = (v: Nullable<number>): string => {
  if (typeof v !== 'number' || Number.isNaN(v)) {
    return '0.00';
  }
  return v.toFixed(2);
};

export const currency = (v: Nullable<number> = 0): string => {
  return `₹${format(v)}`;
};
