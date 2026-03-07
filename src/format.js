/**
 * format.js
 * Functions for formatting numbers in the Indian numbering system.
 * Handles comma placement (thousand, lakh, crore) and currency display.
 */

"use strict";

const { validateNumber, splitNumber } = require("./helpers");

/**
 * Formats the integer portion of a number using the Indian grouping system.
 * - The rightmost 3 digits form the first group (thousands).
 * - Every subsequent group has 2 digits (lakhs, crores, …).
 *
 * @param {string} intStr - The integer part as a string (no sign).
 * @returns {string} The comma-formatted integer string.
 */
function formatIndianInteger(intStr) {
  // Nothing to format for numbers shorter than 4 digits
  if (intStr.length <= 3) {
    return intStr;
  }

  // Last 3 digits
  const lastThree = intStr.slice(-3);
  const remaining = intStr.slice(0, -3);

  // Insert comma every 2 digits from the right in the remaining portion
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${formatted},${lastThree}`;
}

/**
 * Convert a number to Indian comma-formatted string.
 *
 * @param {number|string} number - The number to format.
 * @returns {string} Comma-formatted number string.
 *
 * @example
 * format(1000)      // "1,000"
 * format(100000)    // "1,00,000"
 * format(10000000)  // "1,00,00,000"
 * format(-50000)    // "-50,000"
 * format(1234.56)   // "1,234.56"
 */
function format(number) {
  const num = validateNumber(number);
  const isNegative = num < 0;
  const { integer, decimal } = splitNumber(num);

  let result = formatIndianInteger(integer);

  // Append decimal part if present
  if (decimal) {
    result += `.${decimal}`;
  }

  // Prepend minus sign for negative numbers
  if (isNegative) {
    result = `-${result}`;
  }

  return result;
}

/**
 * Format a number with the ₹ (Indian Rupee) symbol.
 *
 * @param {number|string} number - The number to format.
 * @returns {string} Formatted string prefixed with ₹.
 *
 * @example
 * formatWithSymbol(100000) // "₹1,00,000"
 * formatWithSymbol(-500)   // "-₹500"
 */
function formatWithSymbol(number) {
  const num = validateNumber(number);
  const isNegative = num < 0;
  const { integer, decimal } = splitNumber(num);

  let result = formatIndianInteger(integer);

  if (decimal) {
    result += `.${decimal}`;
  }

  // For negative numbers the minus sign comes before the symbol
  if (isNegative) {
    return `-₹${result}`;
  }

  return `₹${result}`;
}

/**
 * Express a number in "Lakh" units.
 *
 * @param {number|string} number - The number to convert.
 * @returns {string} Value in lakhs with the label.
 *
 * @example
 * lakhs(100000)  // "1 Lakh"
 * lakhs(1000000) // "10 Lakh"
 * lakhs(250000)  // "2.5 Lakh"
 */
function lakhs(number) {
  const num = validateNumber(number);
  const value = num / 100000;

  // Remove unnecessary trailing zeros
  const display = parseFloat(value.toFixed(2));

  return `${display} Lakh`;
}

/**
 * Express a number in "Crore" units.
 *
 * @param {number|string} number - The number to convert.
 * @returns {string} Value in crores with the label.
 *
 * @example
 * crores(10000000)  // "1 Crore"
 * crores(100000000) // "10 Crore"
 * crores(75000000)  // "7.5 Crore"
 */
function crores(number) {
  const num = validateNumber(number);
  const value = num / 10000000;

  const display = parseFloat(value.toFixed(2));

  return `${display} Crore`;
}

module.exports = {
  format,
  formatWithSymbol,
  lakhs,
  crores,
};
