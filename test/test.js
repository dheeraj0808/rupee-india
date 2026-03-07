/**
 * test.js — Test suite for the rupx library.
 *
 * Run with:  npm test   (or)   node test/test.js
 *
 * Uses Node.js built-in assert module — no external test framework needed.
 */

"use strict";

const assert = require("assert");
const rupx = require("../index");

// ── Helpers ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅  ${description}`);
  } catch (err) {
    failed++;
    console.error(`  ❌  ${description}`);
    console.error(`      ${err.message}\n`);
  }
}

function expectThrows(fn, ErrorType) {
  let threw = false;
  try {
    fn();
  } catch (err) {
    threw = true;
    if (ErrorType && !(err instanceof ErrorType)) {
      throw new Error(
        `Expected ${ErrorType.name} but got ${err.constructor.name}: ${err.message}`
      );
    }
  }
  if (!threw) {
    throw new Error(`Expected function to throw ${ErrorType ? ErrorType.name : "an error"}`);
  }
}

// ── format() ────────────────────────────────────────────────────────────────

console.log("\n🔢  format()");

test("formats 0", () => {
  assert.strictEqual(rupx.format(0), "0");
});

test("formats hundreds (999)", () => {
  assert.strictEqual(rupx.format(999), "999");
});

test("formats thousands (1,000)", () => {
  assert.strictEqual(rupx.format(1000), "1,000");
});

test("formats ten-thousands (50,000)", () => {
  assert.strictEqual(rupx.format(50000), "50,000");
});

test("formats lakhs (1,00,000)", () => {
  assert.strictEqual(rupx.format(100000), "1,00,000");
});

test("formats ten-lakhs (10,00,000)", () => {
  assert.strictEqual(rupx.format(1000000), "10,00,000");
});

test("formats crores (1,00,00,000)", () => {
  assert.strictEqual(rupx.format(10000000), "1,00,00,000");
});

test("formats large numbers (1,23,45,67,890)", () => {
  assert.strictEqual(rupx.format(1234567890), "1,23,45,67,890");
});

test("formats negative numbers", () => {
  assert.strictEqual(rupx.format(-100000), "-1,00,000");
});

test("formats decimals", () => {
  assert.strictEqual(rupx.format(1234.56), "1,234.56");
});

test("accepts numeric strings", () => {
  assert.strictEqual(rupx.format("100000"), "1,00,000");
});

// ── formatWithSymbol() ──────────────────────────────────────────────────────

console.log("\n💰  formatWithSymbol()");

test("formats with ₹ symbol", () => {
  assert.strictEqual(rupx.formatWithSymbol(100000), "₹1,00,000");
});

test("formats 0 with ₹ symbol", () => {
  assert.strictEqual(rupx.formatWithSymbol(0), "₹0");
});

test("formats negative with ₹ symbol", () => {
  assert.strictEqual(rupx.formatWithSymbol(-500), "-₹500");
});

test("formats large number with ₹ symbol", () => {
  assert.strictEqual(rupx.formatWithSymbol(10000000), "₹1,00,00,000");
});

// ── toWords() ───────────────────────────────────────────────────────────────

console.log("\n📝  toWords()");

test("converts 0 to words", () => {
  assert.strictEqual(rupx.toWords(0), "Zero Rupees");
});

test("converts 5 to words", () => {
  assert.strictEqual(rupx.toWords(5), "Five Rupees");
});

test("converts 15 to words", () => {
  assert.strictEqual(rupx.toWords(15), "Fifteen Rupees");
});

test("converts 42 to words", () => {
  assert.strictEqual(rupx.toWords(42), "Forty Two Rupees");
});

test("converts 100 to words", () => {
  assert.strictEqual(rupx.toWords(100), "One Hundred Rupees");
});

test("converts 1500 to words", () => {
  assert.strictEqual(rupx.toWords(1500), "One Thousand Five Hundred Rupees");
});

test("converts 100000 (1 lakh) to words", () => {
  assert.strictEqual(rupx.toWords(100000), "One Lakh Rupees");
});

test("converts 10000000 (1 crore) to words", () => {
  assert.strictEqual(rupx.toWords(10000000), "One Crore Rupees");
});

test("converts 1234567 to words", () => {
  assert.strictEqual(
    rupx.toWords(1234567),
    "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Rupees"
  );
});

test("converts negative number to words", () => {
  assert.strictEqual(rupx.toWords(-500), "Minus Five Hundred Rupees");
});

test("converts decimal (paise) to words", () => {
  assert.strictEqual(rupx.toWords(21.50), "Twenty One Rupees and Fifty Paise");
});

// ── lakhs() ─────────────────────────────────────────────────────────────────

console.log("\n🏦  lakhs()");

test("converts 100000 to lakhs", () => {
  assert.strictEqual(rupx.lakhs(100000), "1 Lakh");
});

test("converts 1000000 to lakhs (10 Lakh)", () => {
  assert.strictEqual(rupx.lakhs(1000000), "10 Lakh");
});

test("converts 250000 to lakhs (2.5 Lakh)", () => {
  assert.strictEqual(rupx.lakhs(250000), "2.5 Lakh");
});

test("converts 50000 to lakhs (0.5 Lakh)", () => {
  assert.strictEqual(rupx.lakhs(50000), "0.5 Lakh");
});

// ── crores() ────────────────────────────────────────────────────────────────

console.log("\n🏛️  crores()");

test("converts 10000000 to crores", () => {
  assert.strictEqual(rupx.crores(10000000), "1 Crore");
});

test("converts 100000000 to crores (10 Crore)", () => {
  assert.strictEqual(rupx.crores(100000000), "10 Crore");
});

test("converts 75000000 to crores (7.5 Crore)", () => {
  assert.strictEqual(rupx.crores(75000000), "7.5 Crore");
});

// ── Edge cases & error handling ─────────────────────────────────────────────

console.log("\n⚠️  Edge cases & error handling");

test("throws TypeError for non-numeric input", () => {
  expectThrows(() => rupx.format("abc"), TypeError);
});

test("throws TypeError for boolean input", () => {
  expectThrows(() => rupx.format(true), TypeError);
});

test("throws TypeError for null input", () => {
  expectThrows(() => rupx.format(null), TypeError);
});

test("throws TypeError for undefined input", () => {
  expectThrows(() => rupx.format(undefined), TypeError);
});

test("throws TypeError for empty string", () => {
  expectThrows(() => rupx.format(""), TypeError);
});

test("throws RangeError for Infinity", () => {
  expectThrows(() => rupx.format(Infinity), RangeError);
});

test("throws RangeError for NaN", () => {
  expectThrows(() => rupx.format(NaN), RangeError);
});

test("throws TypeError for object input", () => {
  expectThrows(() => rupx.toWords({}), TypeError);
});

test("throws TypeError for array input", () => {
  expectThrows(() => rupx.lakhs([1, 2]), TypeError);
});

// ── Summary ─────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(50));
console.log(`  Total: ${passed + failed}  |  ✅ Passed: ${passed}  |  ❌ Failed: ${failed}`);
console.log("─".repeat(50) + "\n");

if (failed > 0) {
  process.exit(1);
}
