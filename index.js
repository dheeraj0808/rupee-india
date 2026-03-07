/**
 * rupx — Indian Rupee formatter for Node.js
 *
 * A lightweight, zero-dependency utility library for formatting numbers
 * using the Indian numbering system (thousand, lakh, crore).
 *
 * @example
 * const rupx = require("rupx");
 *
 * rupx.format(1000000);          // "10,00,000"
 * rupx.formatWithSymbol(50000);  // "₹50,000"
 * rupx.toWords(1250);            // "One Thousand Two Hundred Fifty Rupees"
 * rupx.lakhs(1000000);           // "10 Lakh"
 * rupx.crores(10000000);         // "1 Crore"
 */

"use strict";

const { format, formatWithSymbol, lakhs, crores } = require("./src/format");
const { toWords } = require("./src/words");

module.exports = {
  format,
  formatWithSymbol,
  toWords,
  lakhs,
  crores,
};
