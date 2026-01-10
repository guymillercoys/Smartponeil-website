/**
 * Shared phone validation utilities
 * Used by both UI and server-side functions
 */

/**
 * Clean phone number: remove spaces, dashes, parentheses - keep digits only
 * @param {string} phone - Raw phone input
 * @returns {string} - Cleaned phone (digits only)
 */
export function cleanPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return ''
  }
  // Remove spaces, dashes, parentheses, and any non-digit characters
  return phone.replace(/[\s\-()]/g, '').replace(/\D/g, '')
}

/**
 * Validate Israeli phone format: must be exactly 10 digits starting with 0
 * @param {string} phone - Phone number (will be cleaned first)
 * @returns {object} - { valid: boolean, cleaned: string, error?: string }
 */
export function validatePhone(phone) {
  const cleaned = cleanPhone(phone)
  
  // Check for invalid formats
  if (cleaned.includes('+') || cleaned.startsWith('972')) {
    return {
      valid: false,
      cleaned,
      error: 'נא להזין מספר בפורמט ישראלי שמתחיל ב-0 (לדוגמה: 0501234567)'
    }
  }
  
  // Must match exactly 10 digits starting with 0
  if (!/^0\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      cleaned,
      error: 'נא להזין מספר בפורמט ישראלי שמתחיל ב-0 (לדוגמה: 0501234567)'
    }
  }
  
  return {
    valid: true,
    cleaned
  }
}

