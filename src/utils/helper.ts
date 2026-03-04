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
  const num = Number(v);
  if (!Number.isFinite(num)) return '0.00';
  return num.toFixed(2);
};

export const currency = (v: Nullable<number> = 0): string => {
  const num = Number(v);
  if (!Number.isFinite(num)) return '₹0.00';

  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const simpleToCompound = (stock: string, conf: string) => {
  return String(
    (Number.parseFloat(String(stock)) || 0) / Number.parseFloat(String(conf)),
  );
};

export const compoundToSimple = (stock: string, conf: string) => {
  return String(
    (Number.parseFloat(String(stock)) || 0) * Number.parseFloat(String(conf)),
  );
};
