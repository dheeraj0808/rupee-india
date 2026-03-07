/**
 * helpers.js
 * Shared validation and utility functions for the rupx library.
 *
 * Cross-platform notes:
 * - Uses only ES2015+ features guaranteed in Node.js 16+
 * - No locale-dependent APIs (e.g. toLocaleString) to ensure identical
 *   output on every OS, container, and CI environment.
 */

"use strict";

/**
 * Validates that the input is a finite number (or a numeric string).
 * Throws a TypeError for non-numeric values and a RangeError for
 * Infinity / -Infinity / NaN.
 *
 * @param {*} value - The value to validate.
 * @returns {number} The parsed number.
 */
function validateNumber(value) {
  // Accept numeric strings — parse them first
  if (typeof value === "string") {
    value = value.trim();
    if (value === "") {
      throw new TypeError("rupx: Expected a number but received an empty string.");
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      throw new TypeError(
        "rupx: Expected a numeric string but received \"" + value + "\"."
      );
    }
    value = parsed;
  }

  if (typeof value !== "number") {
    throw new TypeError(
      "rupx: Expected a number but received " + typeof value + "."
    );
  }

  if (!Number.isFinite(value)) {
    throw new RangeError("rupx: Number must be finite (no Infinity or NaN).");
  }

  return value;
}

/**
 * Splits a number into its integer and decimal parts.
 *
 * Uses toFixed() for consistency: JavaScript's toString() can produce
 * scientific notation for very large / very small numbers (e.g. 1e+21),
 * which would break formatting. We cap decimal precision at 10 digits
 * to stay within safe floating-point territory.
 *
 * @param {number} num - A finite number.
 * @returns {{ integer: string, decimal: string }} Parts of the number.
 */
function splitNumber(num) {
  var abs = Math.abs(num);

  // For integers, fast path — avoid floating-point artifacts
  if (Number.isInteger(abs)) {
    return {
      integer: safeIntegerString(abs),
      decimal: "",
    };
  }

  // Convert to string carefully to avoid scientific notation
  var str = toFixedSafe(abs);
  var dotIndex = str.indexOf(".");

  if (dotIndex === -1) {
    return {
      integer: str,
      decimal: "",
    };
  }

  return {
    integer: str.slice(0, dotIndex),
    decimal: str.slice(dotIndex + 1).replace(/0+$/, ""), // trim trailing zeros
  };
}

/**
 * Converts a non-negative integer to its full decimal string representation
 * without scientific notation. Works for numbers up to Number.MAX_SAFE_INTEGER.
 *
 * @param {number} n - Non-negative integer.
 * @returns {string} Full decimal string.
 */
function safeIntegerString(n) {
  if (n <= Number.MAX_SAFE_INTEGER) {
    return String(n);
  }
  // Fallback: use toFixed to avoid scientific notation for huge integers
  return n.toFixed(0);
}

/**
 * Like Number.prototype.toFixed but avoids scientific notation for very
 * large numbers and trims unnecessary trailing zeros.
 *
 * @param {number} n - Non-negative finite number.
 * @returns {string} String representation without scientific notation.
 */
function toFixedSafe(n) {
  // For numbers that would render in scientific notation, use toFixed
  var str = String(n);
  if (str.indexOf("e") !== -1 || str.indexOf("E") !== -1) {
    // toFixed with enough precision to avoid loss
    return n.toFixed(10).replace(/\.?0+$/, "");
  }
  return str;
}

module.exports = {
  validateNumber,
  splitNumber,
};
