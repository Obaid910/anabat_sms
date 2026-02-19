/**
 * Validation utility functions
 */

// Email validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) return 'Invalid phone number format';
  if (phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
  return '';
};

// Required field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

// Min length validation
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return '';
};

// Max length validation
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return '';
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return '';
  try {
    new URL(url);
    return '';
  } catch {
    return 'Invalid URL format';
  }
};

// Number validation
export const validateNumber = (value, fieldName = 'This field') => {
  if (value && isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  return '';
};

// Positive number validation
export const validatePositiveNumber = (value, fieldName = 'This field') => {
  const numberError = validateNumber(value, fieldName);
  if (numberError) return numberError;
  if (value && parseFloat(value) < 0) {
    return `${fieldName} must be a positive number`;
  }
  return '';
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Invalid ${fieldName.toLowerCase()}`;
  }
  return '';
};

// Future date validation
export const validateFutureDate = (date, fieldName = 'Date') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  if (date && new Date(date) < new Date()) {
    return `${fieldName} must be in the future`;
  }
  return '';
};

// Past date validation
export const validatePastDate = (date, fieldName = 'Date') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  if (date && new Date(date) > new Date()) {
    return `${fieldName} must be in the past`;
  }
  return '';
};

// Postal code validation
export const validatePostalCode = (postalCode) => {
  if (!postalCode) return '';
  if (!/^\d{5}(-\d{4})?$/.test(postalCode)) {
    return 'Invalid postal code format';
  }
  return '';
};

// Validate form object
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = formData[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return errors;
};

// Check if form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).some(key => errors[key]);
};

// Lead-specific validations
export const validateLeadForm = (formData) => {
  const errors = {};

  // Personal Information
  if (!formData.first_name?.trim()) errors.first_name = 'First name is required';
  if (!formData.last_name?.trim()) errors.last_name = 'Last name is required';
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  // Phone is optional for lead, but validate format if provided
  if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
    errors.phone = 'Invalid phone format';
  }

  // Parent Information
  if (!formData.parent_name?.trim()) errors.parent_name = 'Parent name is required';
  if (!formData.parent_phone?.trim()) errors.parent_phone = 'Parent phone is required';
  if (formData.parent_phone && !/^[\d\s\-\+\(\)]+$/.test(formData.parent_phone)) {
    errors.parent_phone = 'Invalid phone format';
  }
  if (formData.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parent_email)) {
    errors.parent_email = 'Invalid email format';
  }

  // Lead Information
  if (formData.estimated_fee && isNaN(formData.estimated_fee)) {
    errors.estimated_fee = 'Must be a valid number';
  }
  if (formData.estimated_fee && parseFloat(formData.estimated_fee) < 0) {
    errors.estimated_fee = 'Must be a positive number';
  }

  return errors;
};

// User-specific validations
export const validateUserForm = (formData, isEdit = false) => {
  const errors = {};

  if (!formData.name?.trim()) errors.name = 'Name is required';
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!isEdit) {
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
  }

  if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
    errors.phone = 'Invalid phone format';
  }

  return errors;
};

// Branch-specific validations
export const validateBranchForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) errors.name = 'Branch name is required';
  if (!formData.code?.trim()) {
    errors.code = 'Branch code is required';
  } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
    errors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
  }

  if (formData.contact_info?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_info.email)) {
    errors['contact_info.email'] = 'Invalid email format';
  }

  if (formData.contact_info?.website) {
    try {
      new URL(formData.contact_info.website);
    } catch {
      errors['contact_info.website'] = 'Invalid URL format';
    }
  }

  return errors;
};

export default {
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePassword,
  validateConfirmPassword,
  validateUrl,
  validateNumber,
  validatePositiveNumber,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validatePostalCode,
  validateForm,
  hasErrors,
  validateLeadForm,
  validateUserForm,
  validateBranchForm,
};
