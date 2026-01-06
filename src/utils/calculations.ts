import { InvoiceItem } from '../types';

export const calculateItemAmount = (quantity: any, rate: any, taxRate: any) => {
  const baseAmount = quantity * rate;
  const taxAmount = (baseAmount * taxRate) / 100;
  const totalAmount = baseAmount + taxAmount;

  return {
    baseAmount: Number.parseFloat(baseAmount?.toFixed(2)),
    taxAmount: Number.parseFloat(taxAmount?.toFixed(2)),
    totalAmount: Number.parseFloat(totalAmount?.toFixed(2)),
  };
};

export const calculateInvoiceTotals = (items: InvoiceItem[]) => {
  let subtotal = 0;
  let totalTax = 0;

  items.forEach((item: InvoiceItem) => {
    subtotal += Number(item.quantity) * Number(item.sellingRate);
    totalTax += Number(item.taxAmount);
  });

  const taxableAmount = subtotal;
  const cgst = totalTax / 2;
  const sgst = totalTax / 2;
  const totalAmount = subtotal + totalTax;

  return {
    subtotal: Number.parseFloat(subtotal?.toFixed(2)),
    taxableAmount: Number.parseFloat(taxableAmount?.toFixed(2)),
    cgstTotal: Number.parseFloat(cgst?.toFixed(2)),
    sgstTotal: Number.parseFloat(sgst?.toFixed(2)),
    totalAmount: Number.parseFloat(totalAmount?.toFixed(2)),
  };
};

export const convertAmountToWords = (amount: number) => {
  if (amount == null || Number.isNaN(amount)) return '';

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  const convertToWords = (num: number): string => {
    if (num === 0) return '';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] + ' Hundred ' + convertToWords(num % 100)
      );
    if (num < 100000)
      return (
        convertToWords(Math.floor(num / 1000)) +
        ' Thousand ' +
        convertToWords(num % 1000)
      );
    if (num < 10000000)
      return (
        convertToWords(Math.floor(num / 100000)) +
        ' Lakh ' +
        convertToWords(num % 100000)
      );
    return (
      convertToWords(Math.floor(num / 10000000)) +
      ' Crore ' +
      convertToWords(num % 10000000)
    );
  };

  const [rupees, paise] = Number(amount)?.toFixed(2).split('.');
  let result = convertToWords(Number.parseInt(rupees))?.trim();
  if (!result) result = 'Zero';
  result += ' Rupees';

  if (Number.parseInt(paise) > 0) {
    result += ' and ' + convertToWords(Number.parseInt(paise)) + ' Paise';
  }

  return result.trim();
};
