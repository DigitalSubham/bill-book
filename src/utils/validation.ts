import { ProductBaseType, ProductFormErrors } from '../types';

export const productValidateForm = (
  formData: ProductBaseType,
  setErrors: (errors: ProductFormErrors) => void,
): boolean => {
  const newErrors: ProductFormErrors = {};

  const mrp = Number(formData.mrp);
  const rate = Number(formData.rate);
  const stock = Number(formData.stock);
  const conversionFactor = Number(formData.conversionFactor);

  if (!formData.name.trim()) {
    newErrors.name = 'Product name is required';
  }

  if (Number.isNaN(mrp) || mrp <= 0) {
    newErrors.mrp = 'MRP must be greater than 0';
  }

  if (Number.isNaN(rate) || rate <= 0) {
    newErrors.rate = 'Rate must be greater than 0';
  } else if (rate > mrp) {
    newErrors.rate = 'Rate cannot be greater than MRP';
  }

  if (!formData.taxRate || Number.isNaN(Number(formData.taxRate))) {
    newErrors.taxRate = 'Valid tax rate is required';
  }

  if (Number.isNaN(stock) || stock < 0) {
    newErrors.stock = 'Stock cannot be negative';
  }

  if (formData.unitType === 'COMPOUND') {
    if (Number.isNaN(conversionFactor) || conversionFactor <= 1) {
      newErrors.conversionFactor = 'Conversion factor must be greater than 1';
    }

    if (!Number.isInteger(conversionFactor)) {
      newErrors.conversionFactor = 'Conversion factor must be a whole number';
    }

    if (!formData.baseUnit) {
      newErrors.unit = 'Base unit is required';
    }

    if (formData.baseUnit === formData.unit) {
      newErrors.unit = 'Unit and base unit cannot be the same';
    }

    if (stock * conversionFactor < 1) {
      newErrors.stock = `Stock too small for base unit conversion`;
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
