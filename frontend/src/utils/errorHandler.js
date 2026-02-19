/**
 * Error handling utilities for API responses
 */

/**
 * Extract error message from API response
 */
export const getErrorMessage = (error) => {
  // If error is a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Check for response data
  if (error?.response?.data) {
    const { data } = error.response;

    // Laravel validation errors
    if (data.errors) {
      // If errors is an object with field-specific errors
      if (typeof data.errors === 'object') {
        const firstError = Object.values(data.errors)[0];
        return Array.isArray(firstError) ? firstError[0] : firstError;
      }
      return data.errors;
    }

    // General error message
    if (data.message) {
      return data.message;
    }

    // Error string
    if (typeof data.error === 'string') {
      return data.error;
    }
  }

  // Check for error message directly
  if (error?.message) {
    return error.message;
  }

  // Network errors
  if (error?.request && !error?.response) {
    return 'Network error. Please check your connection.';
  }

  // Default error
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract validation errors from API response
 * Returns an object with field names as keys and error messages as values
 */
export const getValidationErrors = (error) => {
  const validationErrors = {};

  if (error?.response?.data?.errors) {
    const { errors } = error.response.data;

    // Laravel validation errors format
    if (typeof errors === 'object') {
      Object.keys(errors).forEach(field => {
        const fieldErrors = errors[field];
        // Take the first error message for each field
        validationErrors[field] = Array.isArray(fieldErrors) 
          ? fieldErrors[0] 
          : fieldErrors;
      });
    }
  }

  return validationErrors;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error) => {
  return error?.response?.status === 422 || 
         (error?.response?.data?.errors && typeof error.response.data.errors === 'object');
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

/**
 * Check if error is a forbidden error
 */
export const isForbiddenError = (error) => {
  return error?.response?.status === 403;
};

/**
 * Check if error is a not found error
 */
export const isNotFoundError = (error) => {
  return error?.response?.status === 404;
};

/**
 * Check if error is a server error
 */
export const isServerError = (error) => {
  return error?.response?.status >= 500;
};

/**
 * Format error for display in a snackbar/toast
 */
export const formatErrorForToast = (error) => {
  const message = getErrorMessage(error);
  const severity = isServerError(error) ? 'error' : 
                   isValidationError(error) ? 'warning' : 
                   'error';

  return {
    message,
    severity,
  };
};

/**
 * Handle API error and return formatted response
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);

  // Check for specific error types
  if (isAuthError(error)) {
    return {
      message: 'Your session has expired. Please login again.',
      type: 'auth',
      shouldLogout: true,
    };
  }

  if (isForbiddenError(error)) {
    return {
      message: 'You do not have permission to perform this action.',
      type: 'forbidden',
    };
  }

  if (isNotFoundError(error)) {
    return {
      message: 'The requested resource was not found.',
      type: 'notFound',
    };
  }

  if (isValidationError(error)) {
    return {
      message: getErrorMessage(error),
      type: 'validation',
      errors: getValidationErrors(error),
    };
  }

  if (isServerError(error)) {
    return {
      message: 'Server error. Please try again later.',
      type: 'server',
    };
  }

  // Default error
  return {
    message: getErrorMessage(error) || defaultMessage,
    type: 'general',
  };
};

/**
 * Merge backend validation errors with frontend errors
 */
export const mergeErrors = (frontendErrors, backendErrors) => {
  return {
    ...frontendErrors,
    ...backendErrors,
  };
};

/**
 * Clear specific field error
 */
export const clearFieldError = (errors, fieldName) => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

/**
 * Set field error
 */
export const setFieldError = (errors, fieldName, errorMessage) => {
  return {
    ...errors,
    [fieldName]: errorMessage,
  };
};

export default {
  getErrorMessage,
  getValidationErrors,
  isValidationError,
  isAuthError,
  isForbiddenError,
  isNotFoundError,
  isServerError,
  formatErrorForToast,
  handleApiError,
  mergeErrors,
  clearFieldError,
  setFieldError,
};
