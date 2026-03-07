/**
 * helpers.js
 * Shared validation and utility functions for the rupx library.
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
    value = Number(value);
  }

  if (typeof value !== "number") {
    throw new TypeError(
      `rupx: Expected a number but received ${typeof value}.`
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
 * @param {number} num - A finite number.
 * @returns {{ integer: string, decimal: string }} Parts of the number.
 */
function splitNumber(num) {
  const abs = Math.abs(num);
  const parts = abs.toString().split(".");

  return {
    integer: parts[0],
    decimal: parts[1] || "",
  };
}

module.exports = {
  validateNumber,
  splitNumber,
};
