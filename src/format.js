/**
 * format.js
 * Functions for formatting numbers in the Indian numbering system.
 * Handles comma placement (thousand, lakh, crore) and currency display.
 *
 * Cross-platform: Does NOT use Intl or toLocaleString — output is
 * identical on Linux, macOS, Windows, Docker, and minimal Alpine images.
 */

"use strict";

var helpers = require("./helpers");
var validateNumber = helpers.validateNumber;
var splitNumber = helpers.splitNumber;

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
  var lastThree = intStr.slice(-3);
  var remaining = intStr.slice(0, -3);

  // Insert comma every 2 digits from the right in the remaining portion
  var formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return formatted + "," + lastThree;
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
  var num = validateNumber(number);
  var isNegative = num < 0;
  var parts = splitNumber(num);

  var result = formatIndianInteger(parts.integer);

  // Append decimal part if present
  if (parts.decimal) {
    result += "." + parts.decimal;
  }

  // Prepend minus sign for negative numbers
  if (isNegative) {
    result = "-" + result;
  }

  return result;
}

/**
 * Format a number with the Indian Rupee symbol (₹).
 *
 * @param {number|string} number - The number to format.
 * @returns {string} Formatted string prefixed with ₹.
 *
 * @example
 * formatWithSymbol(100000) // "₹1,00,000"
 * formatWithSymbol(-500)   // "-₹500"
 */
function formatWithSymbol(number) {
  var num = validateNumber(number);
  var isNegative = num < 0;
  var parts = splitNumber(num);

  var result = formatIndianInteger(parts.integer);

  if (parts.decimal) {
    result += "." + parts.decimal;
  }

  // For negative numbers the minus sign comes before the symbol
  if (isNegative) {
    return "-\u20B9" + result;   // \u20B9 = ₹ (safe Unicode escape)
  }

  return "\u20B9" + result;      // \u20B9 = ₹
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
  var num = validateNumber(number);
  var value = num / 100000;

  // Remove unnecessary trailing zeros, keep up to 2 decimals
  var display = parseFloat(value.toFixed(2));

  return display + " Lakh";
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
  var num = validateNumber(number);
  var value = num / 10000000;

  var display = parseFloat(value.toFixed(2));

  return display + " Crore";
}

module.exports = {
  format: format,
  formatWithSymbol: formatWithSymbol,
  lakhs: lakhs,
  crores: crores,
};
