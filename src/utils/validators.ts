import { CustomerBaseType, FormErrors } from '../types';

export const validateForm = (
  formData: CustomerBaseType,
  setErrors: any,
): boolean => {
  const newErrors: FormErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Customer name is required';
  }

  if (!formData.mobile.trim()) {
    newErrors.mobile = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(formData.mobile)) {
    newErrors.mobile = 'Invalid mobile number (10 digits required)';
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Invalid email address';
  }

  if (
    formData.gst_number &&
    !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[\dA-Z]$/.test(formData.gst_number)
  ) {
    newErrors.gst_number = 'Invalid gst_number format (e.g., 22AAAAA0000A1Z5)';
  }

  if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
    newErrors.pincode = 'Invalid pincode (6 digits required)';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
