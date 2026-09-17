/**
 * Validates an email address format.
 * @param {string} email
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, message: 'Email is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates a password.
 * @param {string} password
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters.' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates that a required field has a value.
 * @param {string} value
 * @param {string} fieldName - Human-readable field name for the error message
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) {
    return { isValid: false, message: `${fieldName} is required.` };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates that two password values match.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match.' };
  }
  return { isValid: true, message: '' };
}
