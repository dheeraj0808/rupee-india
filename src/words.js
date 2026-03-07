/**
 * words.js
 * Converts numbers into Indian-English currency words.
 *
 * Supports values from 0 up to 99,99,99,99,999 (99 arab / ~10 billion).
 * Decimals are expressed as paise (up to 2 decimal places).
 *
 * Cross-platform: Pure arithmetic — no Intl, no locale dependency.
 */

"use strict";

var helpers = require("./helpers");
var validateNumber = helpers.validateNumber;

// ── Word lookup tables ──────────────────────────────────────────────────────

var ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

var TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty",
  "Ninety",
];

// Indian higher-order denominators (descending by value)
var DENOMINATORS = [
  { value: 10000000, label: "Crore" },
  { value: 100000,   label: "Lakh" },
  { value: 1000,     label: "Thousand" },
  { value: 100,      label: "Hundred" },
];

// ── Internal helpers ────────────────────────────────────────────────────────

/**
 * Converts a two-digit number (0–99) into words.
 *
 * @param {number} n - Integer between 0 and 99.
 * @returns {string} The number in words (empty string for 0).
 */
function twoDigitWords(n) {
  if (n < 20) {
    return ONES[n];
  }
  var ten = TENS[Math.floor(n / 10)];
  var one = ONES[n % 10];
  return one ? ten + " " + one : ten;
}

/**
 * Recursively converts a non-negative integer into Indian-English words.
 *
 * @param {number} n - Non-negative integer.
 * @returns {string} The number expressed in words.
 */
function integerToWords(n) {
  if (n === 0) {
    return "";
  }

  if (n < 100) {
    return twoDigitWords(n);
  }

  for (var i = 0; i < DENOMINATORS.length; i++) {
    var denom = DENOMINATORS[i];
    if (n >= denom.value) {
      var quotient = Math.floor(n / denom.value);
      var remainder = n % denom.value;

      var quotientWords = integerToWords(quotient);
      var remainderWords = integerToWords(remainder);

      if (remainderWords) {
        return quotientWords + " " + denom.label + " " + remainderWords;
      }
      return quotientWords + " " + denom.label;
    }
  }

  // Fallback (should never be reached for valid input)
  return "";
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Convert a number to Indian currency words.
 *
 * @param {number|string} number - The number to convert.
 * @returns {string} Human-readable Indian-English currency string.
 *
 * @example
 * toWords(0)       // "Zero Rupees"
 * toWords(1500)    // "One Thousand Five Hundred Rupees"
 * toWords(100000)  // "One Lakh Rupees"
 * toWords(21.50)   // "Twenty One Rupees and Fifty Paise"
 * toWords(-500)    // "Minus Five Hundred Rupees"
 */
function toWords(number) {
  var num = validateNumber(number);
  var isNegative = num < 0;
  var abs = Math.abs(num);

  // Separate integer and paise (2 decimal places, rounded)
  var integerPart = Math.floor(abs);
  var decimalPart = Math.round((abs - integerPart) * 100);

  // Guard against floating-point overshoot (e.g. 0.995 * 100 = 99.5 → 100)
  if (decimalPart >= 100) {
    integerPart += 1;
    decimalPart = 0;
  }

  var words = "";

  // Integer portion
  if (integerPart === 0 && decimalPart === 0) {
    words = "Zero Rupees";
  } else if (integerPart === 0) {
    words = "Zero Rupees";
  } else {
    words = integerToWords(integerPart) + " Rupees";
  }

  // Paise portion (only if there are paise)
  if (decimalPart > 0) {
    words += " and " + integerToWords(decimalPart) + " Paise";
  }

  // Negative prefix
  if (isNegative) {
    words = "Minus " + words;
  }

  return words;
}

module.exports = {
  toWords: toWords,
};
