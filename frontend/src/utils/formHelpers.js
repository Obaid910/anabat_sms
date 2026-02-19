/**
 * Form helper utilities
 */

/**
 * Scroll to the first field with an error
 * @param {Object} errors - Object with field names as keys
 */
export const scrollToFirstError = (errors) => {
  const errorFields = Object.keys(errors);
  
  if (errorFields.length === 0) {
    return;
  }

  const firstErrorField = errorFields[0];
  
  // Try to find the input element by name
  const element = document.querySelector(`[name="${firstErrorField}"]`);
  
  if (element) {
    // Scroll to the element with smooth behavior
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    
    // Focus the element after a short delay to ensure scroll completes
    setTimeout(() => {
      element.focus();
    }, 300);
  }
};

/**
 * Highlight all fields with errors by adding a class and inline styles
 * @param {Object} errors - Object with field names as keys
 */
export const highlightErrorFields = (errors) => {
  const errorFields = Object.keys(errors);
  
  // Remove existing highlights first
  document.querySelectorAll('.field-error-highlight').forEach(el => {
    el.classList.remove('field-error-highlight');
    el.style.animation = '';
  });
  
  // Small delay to ensure class removal is processed
  setTimeout(() => {
    // Add highlights to error fields
    errorFields.forEach(fieldName => {
      const element = document.querySelector(`[name="${fieldName}"]`);
      if (element) {
        // Find the MUI input wrapper for visible effects
        const inputWrapper = element.closest('.MuiOutlinedInput-root');
        const parentContainer = element.closest('.MuiFormControl-root');
        
        if (inputWrapper) {
          // Apply VERY visible red background flash
          inputWrapper.style.transition = 'all 0.3s ease';
          inputWrapper.style.backgroundColor = 'rgba(211, 47, 47, 0.15)';
          inputWrapper.style.transform = 'scale(1.02)';
          
          // Flash effect
          setTimeout(() => {
            inputWrapper.style.backgroundColor = 'rgba(211, 47, 47, 0.05)';
            inputWrapper.style.transform = 'scale(1)';
          }, 300);
          
          setTimeout(() => {
            inputWrapper.style.backgroundColor = 'rgba(211, 47, 47, 0.15)';
            inputWrapper.style.transform = 'scale(1.02)';
          }, 600);
          
          setTimeout(() => {
            inputWrapper.style.backgroundColor = '';
            inputWrapper.style.transform = '';
          }, 900);
        }
        
        // Add class for CSS animations (no border manipulation)
        if (parentContainer) {
          parentContainer.classList.add('field-error-highlight');
        }
      }
    });
  }, 10);
};

/**
 * Remove error highlights from all fields
 */
export const clearErrorHighlights = () => {
  document.querySelectorAll('.field-error-highlight').forEach(el => {
    el.classList.remove('field-error-highlight');
  });
};

/**
 * Scroll to and highlight the first error field
 * @param {Object} errors - Object with field names as keys
 */
export const scrollToAndHighlightErrors = (errors) => {
  if (!errors || Object.keys(errors).length === 0) {
    clearErrorHighlights();
    return;
  }
  
  highlightErrorFields(errors);
  scrollToFirstError(errors);
};

/**
 * Get the first error message from errors object
 * @param {Object} errors - Object with field names as keys
 * @returns {string} - First error message
 */
export const getFirstErrorMessage = (errors) => {
  const errorFields = Object.keys(errors);
  if (errorFields.length === 0) {
    return '';
  }
  
  const firstField = errorFields[0];
  return errors[firstField];
};

/**
 * Count total number of errors
 * @param {Object} errors - Object with field names as keys
 * @returns {number} - Number of errors
 */
export const countErrors = (errors) => {
  return Object.keys(errors).length;
};

export default {
  scrollToFirstError,
  highlightErrorFields,
  clearErrorHighlights,
  scrollToAndHighlightErrors,
  getFirstErrorMessage,
  countErrors,
};
