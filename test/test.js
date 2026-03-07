/**
 * test.js — Comprehensive test suite for the rupx library.
 *
 * Run with:  npm test   (or)   node test/test.js
 *
 * Uses Node.js built-in assert module — no external test framework needed.
 *
 * Coverage:
 *  ✓ All 5 public API functions
 *  ✓ Indian comma formatting (1–10+ digit numbers)
 *  ✓ Negative numbers & decimals
 *  ✓ Number-to-words with all denominations
 *  ✓ Paise handling (decimal → words)
 *  ✓ Floating-point edge cases
 *  ✓ Boundary values (0, 1, MAX_SAFE_INTEGER)
 *  ✓ String inputs
 *  ✓ Invalid/malicious inputs (null, undefined, object, array, Symbol, etc.)
 *  ✓ Unicode ₹ symbol correctness
 *  ✓ Module export structure
 *  ✓ Cross-platform consistency checks
 */

"use strict";

var assert = require("assert");
var rupx = require("../index");

// ── Test runner ─────────────────────────────────────────────────────────────

var passed = 0;
var failed = 0;
var failures = [];

function test(description, fn) {
  try {
    fn();
    passed++;
    console.log("  \u2705  " + description);
  } catch (err) {
    failed++;
    failures.push({ description: description, error: err.message });
    console.error("  \u274C  " + description);
    console.error("      " + err.message + "\n");
  }
}

function expectThrows(fn, ErrorType) {
  var threw = false;
  try {
    fn();
  } catch (err) {
    threw = true;
    if (ErrorType && !(err instanceof ErrorType)) {
      throw new Error(
        "Expected " + ErrorType.name + " but got " + err.constructor.name + ": " + err.message
      );
    }
  }
  if (!threw) {
    throw new Error("Expected function to throw " + (ErrorType ? ErrorType.name : "an error"));
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  1. MODULE EXPORTS — ensure the package is structured correctly
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F4E6}  Module exports");

test("rupx is an object", function () {
  assert.strictEqual(typeof rupx, "object");
  assert.notStrictEqual(rupx, null);
});

test("rupx.format is a function", function () {
  assert.strictEqual(typeof rupx.format, "function");
});

test("rupx.formatWithSymbol is a function", function () {
  assert.strictEqual(typeof rupx.formatWithSymbol, "function");
});

test("rupx.toWords is a function", function () {
  assert.strictEqual(typeof rupx.toWords, "function");
});

test("rupx.lakhs is a function", function () {
  assert.strictEqual(typeof rupx.lakhs, "function");
});

test("rupx.crores is a function", function () {
  assert.strictEqual(typeof rupx.crores, "function");
});

test("rupx has exactly 5 exported keys", function () {
  var keys = Object.keys(rupx);
  assert.strictEqual(keys.length, 5);
});

// ═════════════════════════════════════════════════════════════════════════════
//  2. format() — Indian comma grouping
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F522}  format()");

// ── Basic numbers ───────────────────────────────────────────────────────────

test("format(0) → '0'", function () {
  assert.strictEqual(rupx.format(0), "0");
});

test("format(1) → '1'", function () {
  assert.strictEqual(rupx.format(1), "1");
});

test("format(9) → '9'", function () {
  assert.strictEqual(rupx.format(9), "9");
});

test("format(10) → '10'", function () {
  assert.strictEqual(rupx.format(10), "10");
});

test("format(99) → '99'", function () {
  assert.strictEqual(rupx.format(99), "99");
});

test("format(100) → '100'", function () {
  assert.strictEqual(rupx.format(100), "100");
});

test("format(999) → '999'", function () {
  assert.strictEqual(rupx.format(999), "999");
});

// ── Thousands ───────────────────────────────────────────────────────────────

test("format(1000) → '1,000'", function () {
  assert.strictEqual(rupx.format(1000), "1,000");
});

test("format(9999) → '9,999'", function () {
  assert.strictEqual(rupx.format(9999), "9,999");
});

test("format(10000) → '10,000'", function () {
  assert.strictEqual(rupx.format(10000), "10,000");
});

test("format(50000) → '50,000'", function () {
  assert.strictEqual(rupx.format(50000), "50,000");
});

test("format(99999) → '99,999'", function () {
  assert.strictEqual(rupx.format(99999), "99,999");
});

// ── Lakhs ───────────────────────────────────────────────────────────────────

test("format(100000) → '1,00,000'", function () {
  assert.strictEqual(rupx.format(100000), "1,00,000");
});

test("format(500000) → '5,00,000'", function () {
  assert.strictEqual(rupx.format(500000), "5,00,000");
});

test("format(999999) → '9,99,999'", function () {
  assert.strictEqual(rupx.format(999999), "9,99,999");
});

test("format(1000000) → '10,00,000'", function () {
  assert.strictEqual(rupx.format(1000000), "10,00,000");
});

// ── Crores ──────────────────────────────────────────────────────────────────

test("format(10000000) → '1,00,00,000'", function () {
  assert.strictEqual(rupx.format(10000000), "1,00,00,000");
});

test("format(99999999) → '9,99,99,999'", function () {
  assert.strictEqual(rupx.format(99999999), "9,99,99,999");
});

test("format(100000000) → '10,00,00,000' (10 crore)", function () {
  assert.strictEqual(rupx.format(100000000), "10,00,00,000");
});

// ── Arab+ (very large numbers) ─────────────────────────────────────────────

test("format(1000000000) → '1,00,00,00,000' (100 crore / 1 arab)", function () {
  assert.strictEqual(rupx.format(1000000000), "1,00,00,00,000");
});

test("format(1234567890) → '1,23,45,67,890'", function () {
  assert.strictEqual(rupx.format(1234567890), "1,23,45,67,890");
});

test("format(10000000000) → '10,00,00,00,000' (1000 crore)", function () {
  assert.strictEqual(rupx.format(10000000000), "10,00,00,00,000");
});

test("format(999999999999) → '9,99,99,99,99,999'", function () {
  assert.strictEqual(rupx.format(999999999999), "9,99,99,99,99,999");
});

// ── Negative numbers ────────────────────────────────────────────────────────

test("format(-1) → '-1'", function () {
  assert.strictEqual(rupx.format(-1), "-1");
});

test("format(-1000) → '-1,000'", function () {
  assert.strictEqual(rupx.format(-1000), "-1,000");
});

test("format(-100000) → '-1,00,000'", function () {
  assert.strictEqual(rupx.format(-100000), "-1,00,000");
});

test("format(-10000000) → '-1,00,00,000'", function () {
  assert.strictEqual(rupx.format(-10000000), "-1,00,00,000");
});

// ── Decimal numbers ─────────────────────────────────────────────────────────

test("format(1234.56) → '1,234.56'", function () {
  assert.strictEqual(rupx.format(1234.56), "1,234.56");
});

test("format(100000.99) → '1,00,000.99'", function () {
  assert.strictEqual(rupx.format(100000.99), "1,00,000.99");
});

test("format(0.5) → '0.5'", function () {
  assert.strictEqual(rupx.format(0.5), "0.5");
});

test("format(-1234.56) → '-1,234.56'", function () {
  assert.strictEqual(rupx.format(-1234.56), "-1,234.56");
});

// ── String inputs ───────────────────────────────────────────────────────────

test("format('100000') → '1,00,000'", function () {
  assert.strictEqual(rupx.format("100000"), "1,00,000");
});

test("format('  50000  ') trims whitespace → '50,000'", function () {
  assert.strictEqual(rupx.format("  50000  "), "50,000");
});

test("format('1234.56') → '1,234.56'", function () {
  assert.strictEqual(rupx.format("1234.56"), "1,234.56");
});

test("format('-100000') → '-1,00,000'", function () {
  assert.strictEqual(rupx.format("-100000"), "-1,00,000");
});

// ═════════════════════════════════════════════════════════════════════════════
//  3. formatWithSymbol() — ₹ prefix
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F4B0}  formatWithSymbol()");

test("formatWithSymbol(0) → '₹0'", function () {
  assert.strictEqual(rupx.formatWithSymbol(0), "\u20B90");
});

test("formatWithSymbol(1) → '₹1'", function () {
  assert.strictEqual(rupx.formatWithSymbol(1), "\u20B91");
});

test("formatWithSymbol(999) → '₹999'", function () {
  assert.strictEqual(rupx.formatWithSymbol(999), "\u20B9999");
});

test("formatWithSymbol(1000) → '₹1,000'", function () {
  assert.strictEqual(rupx.formatWithSymbol(1000), "\u20B91,000");
});

test("formatWithSymbol(100000) → '₹1,00,000'", function () {
  assert.strictEqual(rupx.formatWithSymbol(100000), "\u20B91,00,000");
});

test("formatWithSymbol(10000000) → '₹1,00,00,000'", function () {
  assert.strictEqual(rupx.formatWithSymbol(10000000), "\u20B91,00,00,000");
});

test("formatWithSymbol(-500) → '-₹500'", function () {
  assert.strictEqual(rupx.formatWithSymbol(-500), "-\u20B9500");
});

test("formatWithSymbol(-100000) → '-₹1,00,000'", function () {
  assert.strictEqual(rupx.formatWithSymbol(-100000), "-\u20B91,00,000");
});

test("formatWithSymbol(1234.56) → '₹1,234.56'", function () {
  assert.strictEqual(rupx.formatWithSymbol(1234.56), "\u20B91,234.56");
});

test("₹ symbol is correct Unicode codepoint U+20B9", function () {
  var result = rupx.formatWithSymbol(1);
  assert.strictEqual(result.charCodeAt(0), 0x20B9);
});

test("formatWithSymbol accepts string input", function () {
  assert.strictEqual(rupx.formatWithSymbol("50000"), "\u20B950,000");
});

// ═════════════════════════════════════════════════════════════════════════════
//  4. toWords() — number to Indian-English currency words
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F4DD}  toWords()");

// ── Zero ────────────────────────────────────────────────────────────────────

test("toWords(0) → 'Zero Rupees'", function () {
  assert.strictEqual(rupx.toWords(0), "Zero Rupees");
});

// ── Single digits ───────────────────────────────────────────────────────────

test("toWords(1) → 'One Rupees'", function () {
  assert.strictEqual(rupx.toWords(1), "One Rupees");
});

test("toWords(5) → 'Five Rupees'", function () {
  assert.strictEqual(rupx.toWords(5), "Five Rupees");
});

test("toWords(9) → 'Nine Rupees'", function () {
  assert.strictEqual(rupx.toWords(9), "Nine Rupees");
});

// ── Teens ───────────────────────────────────────────────────────────────────

test("toWords(10) → 'Ten Rupees'", function () {
  assert.strictEqual(rupx.toWords(10), "Ten Rupees");
});

test("toWords(11) → 'Eleven Rupees'", function () {
  assert.strictEqual(rupx.toWords(11), "Eleven Rupees");
});

test("toWords(15) → 'Fifteen Rupees'", function () {
  assert.strictEqual(rupx.toWords(15), "Fifteen Rupees");
});

test("toWords(19) → 'Nineteen Rupees'", function () {
  assert.strictEqual(rupx.toWords(19), "Nineteen Rupees");
});

// ── Tens ────────────────────────────────────────────────────────────────────

test("toWords(20) → 'Twenty Rupees'", function () {
  assert.strictEqual(rupx.toWords(20), "Twenty Rupees");
});

test("toWords(42) → 'Forty Two Rupees'", function () {
  assert.strictEqual(rupx.toWords(42), "Forty Two Rupees");
});

test("toWords(99) → 'Ninety Nine Rupees'", function () {
  assert.strictEqual(rupx.toWords(99), "Ninety Nine Rupees");
});

// ── Hundreds ────────────────────────────────────────────────────────────────

test("toWords(100) → 'One Hundred Rupees'", function () {
  assert.strictEqual(rupx.toWords(100), "One Hundred Rupees");
});

test("toWords(101) → 'One Hundred One Rupees'", function () {
  assert.strictEqual(rupx.toWords(101), "One Hundred One Rupees");
});

test("toWords(555) → 'Five Hundred Fifty Five Rupees'", function () {
  assert.strictEqual(rupx.toWords(555), "Five Hundred Fifty Five Rupees");
});

test("toWords(999) → 'Nine Hundred Ninety Nine Rupees'", function () {
  assert.strictEqual(rupx.toWords(999), "Nine Hundred Ninety Nine Rupees");
});

// ── Thousands ───────────────────────────────────────────────────────────────

test("toWords(1000) → 'One Thousand Rupees'", function () {
  assert.strictEqual(rupx.toWords(1000), "One Thousand Rupees");
});

test("toWords(1500) → 'One Thousand Five Hundred Rupees'", function () {
  assert.strictEqual(rupx.toWords(1500), "One Thousand Five Hundred Rupees");
});

test("toWords(10000) → 'Ten Thousand Rupees'", function () {
  assert.strictEqual(rupx.toWords(10000), "Ten Thousand Rupees");
});

test("toWords(99999) → 'Ninety Nine Thousand Nine Hundred Ninety Nine Rupees'", function () {
  assert.strictEqual(
    rupx.toWords(99999),
    "Ninety Nine Thousand Nine Hundred Ninety Nine Rupees"
  );
});

// ── Lakhs ───────────────────────────────────────────────────────────────────

test("toWords(100000) → 'One Lakh Rupees'", function () {
  assert.strictEqual(rupx.toWords(100000), "One Lakh Rupees");
});

test("toWords(150000) → 'One Lakh Fifty Thousand Rupees'", function () {
  assert.strictEqual(rupx.toWords(150000), "One Lakh Fifty Thousand Rupees");
});

test("toWords(999999) → 'Nine Lakh ...'", function () {
  assert.strictEqual(
    rupx.toWords(999999),
    "Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine Rupees"
  );
});

// ── Crores ──────────────────────────────────────────────────────────────────

test("toWords(10000000) → 'One Crore Rupees'", function () {
  assert.strictEqual(rupx.toWords(10000000), "One Crore Rupees");
});

test("toWords(12345678) → full word form", function () {
  assert.strictEqual(
    rupx.toWords(12345678),
    "One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees"
  );
});

test("toWords(1234567) → 'Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Rupees'", function () {
  assert.strictEqual(
    rupx.toWords(1234567),
    "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Rupees"
  );
});

// ── Negative numbers ────────────────────────────────────────────────────────

test("toWords(-1) → 'Minus One Rupees'", function () {
  assert.strictEqual(rupx.toWords(-1), "Minus One Rupees");
});

test("toWords(-500) → 'Minus Five Hundred Rupees'", function () {
  assert.strictEqual(rupx.toWords(-500), "Minus Five Hundred Rupees");
});

test("toWords(-100000) → 'Minus One Lakh Rupees'", function () {
  assert.strictEqual(rupx.toWords(-100000), "Minus One Lakh Rupees");
});

// ── Paise (decimals) ────────────────────────────────────────────────────────

test("toWords(0.50) → 'Zero Rupees and Fifty Paise'", function () {
  assert.strictEqual(rupx.toWords(0.50), "Zero Rupees and Fifty Paise");
});

test("toWords(0.01) → 'Zero Rupees and One Paise'", function () {
  assert.strictEqual(rupx.toWords(0.01), "Zero Rupees and One Paise");
});

test("toWords(21.50) → 'Twenty One Rupees and Fifty Paise'", function () {
  assert.strictEqual(rupx.toWords(21.50), "Twenty One Rupees and Fifty Paise");
});

test("toWords(100.75) → 'One Hundred Rupees and Seventy Five Paise'", function () {
  assert.strictEqual(rupx.toWords(100.75), "One Hundred Rupees and Seventy Five Paise");
});

test("toWords(1500.99) → includes paise", function () {
  assert.strictEqual(
    rupx.toWords(1500.99),
    "One Thousand Five Hundred Rupees and Ninety Nine Paise"
  );
});

// ── String inputs ───────────────────────────────────────────────────────────

test("toWords('1500') → works with string input", function () {
  assert.strictEqual(rupx.toWords("1500"), "One Thousand Five Hundred Rupees");
});

// ═════════════════════════════════════════════════════════════════════════════
//  5. lakhs()
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F3E6}  lakhs()");

test("lakhs(0) → '0 Lakh'", function () {
  assert.strictEqual(rupx.lakhs(0), "0 Lakh");
});

test("lakhs(50000) → '0.5 Lakh'", function () {
  assert.strictEqual(rupx.lakhs(50000), "0.5 Lakh");
});

test("lakhs(100000) → '1 Lakh'", function () {
  assert.strictEqual(rupx.lakhs(100000), "1 Lakh");
});

test("lakhs(250000) → '2.5 Lakh'", function () {
  assert.strictEqual(rupx.lakhs(250000), "2.5 Lakh");
});

test("lakhs(1000000) → '10 Lakh'", function () {
  assert.strictEqual(rupx.lakhs(1000000), "10 Lakh");
});

test("lakhs(10000000) → '100 Lakh'", function () {
  assert.strictEqual(rupx.lakhs(10000000), "100 Lakh");
});

test("lakhs(-500000) → '-5 Lakh'", function () {
  assert.strictEqual(rupx.lakhs(-500000), "-5 Lakh");
});

test("lakhs accepts string input", function () {
  assert.strictEqual(rupx.lakhs("1000000"), "10 Lakh");
});

// ═════════════════════════════════════════════════════════════════════════════
//  6. crores()
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F3DB}\uFE0F  crores()");

test("crores(0) → '0 Crore'", function () {
  assert.strictEqual(rupx.crores(0), "0 Crore");
});

test("crores(5000000) → '0.5 Crore'", function () {
  assert.strictEqual(rupx.crores(5000000), "0.5 Crore");
});

test("crores(10000000) → '1 Crore'", function () {
  assert.strictEqual(rupx.crores(10000000), "1 Crore");
});

test("crores(75000000) → '7.5 Crore'", function () {
  assert.strictEqual(rupx.crores(75000000), "7.5 Crore");
});

test("crores(100000000) → '10 Crore'", function () {
  assert.strictEqual(rupx.crores(100000000), "10 Crore");
});

test("crores(1000000000) → '100 Crore'", function () {
  assert.strictEqual(rupx.crores(1000000000), "100 Crore");
});

test("crores(-50000000) → '-5 Crore'", function () {
  assert.strictEqual(rupx.crores(-50000000), "-5 Crore");
});

test("crores accepts string input", function () {
  assert.strictEqual(rupx.crores("10000000"), "1 Crore");
});

// ═════════════════════════════════════════════════════════════════════════════
//  7. ERROR HANDLING — invalid inputs across ALL functions
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u26A0\uFE0F  Error handling (all functions)");

var allFunctions = [
  { name: "format", fn: rupx.format },
  { name: "formatWithSymbol", fn: rupx.formatWithSymbol },
  { name: "toWords", fn: rupx.toWords },
  { name: "lakhs", fn: rupx.lakhs },
  { name: "crores", fn: rupx.crores },
];

allFunctions.forEach(function (entry) {
  test(entry.name + " throws TypeError for null", function () {
    expectThrows(function () { entry.fn(null); }, TypeError);
  });

  test(entry.name + " throws TypeError for undefined", function () {
    expectThrows(function () { entry.fn(undefined); }, TypeError);
  });

  test(entry.name + " throws TypeError for boolean (true)", function () {
    expectThrows(function () { entry.fn(true); }, TypeError);
  });

  test(entry.name + " throws TypeError for boolean (false)", function () {
    expectThrows(function () { entry.fn(false); }, TypeError);
  });

  test(entry.name + " throws TypeError for object {}", function () {
    expectThrows(function () { entry.fn({}); }, TypeError);
  });

  test(entry.name + " throws TypeError for array []", function () {
    expectThrows(function () { entry.fn([]); }, TypeError);
  });

  test(entry.name + " throws TypeError for non-numeric string 'abc'", function () {
    expectThrows(function () { entry.fn("abc"); }, TypeError);
  });

  test(entry.name + " throws TypeError for empty string ''", function () {
    expectThrows(function () { entry.fn(""); }, TypeError);
  });

  test(entry.name + " throws TypeError for whitespace-only string '   '", function () {
    expectThrows(function () { entry.fn("   "); }, TypeError);
  });

  test(entry.name + " throws RangeError for Infinity", function () {
    expectThrows(function () { entry.fn(Infinity); }, RangeError);
  });

  test(entry.name + " throws RangeError for -Infinity", function () {
    expectThrows(function () { entry.fn(-Infinity); }, RangeError);
  });

  test(entry.name + " throws RangeError for NaN", function () {
    expectThrows(function () { entry.fn(NaN); }, RangeError);
  });

  test(entry.name + " throws TypeError for function input", function () {
    expectThrows(function () { entry.fn(function () {}); }, TypeError);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
//  8. FLOATING-POINT EDGE CASES
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F9EE}  Floating-point edge cases");

test("format(0.1 + 0.2) handles float imprecision gracefully", function () {
  // 0.1 + 0.2 = 0.30000000000000004 in JS — should still format
  var result = rupx.format(0.1 + 0.2);
  assert.ok(result.startsWith("0.3"), "Expected '0.3...' but got: " + result);
});

test("format(Number.MAX_SAFE_INTEGER) formats without error", function () {
  var result = rupx.format(Number.MAX_SAFE_INTEGER); // 9007199254740991
  assert.ok(result.length > 0);
  assert.ok(result.indexOf(",") !== -1, "Should contain commas");
});

test("format(0.001) → '0.001'", function () {
  assert.strictEqual(rupx.format(0.001), "0.001");
});

test("format(-0) → '0' (negative zero treated as zero)", function () {
  assert.strictEqual(rupx.format(-0), "0");
});

// ═════════════════════════════════════════════════════════════════════════════
//  9. CROSS-PLATFORM CONSISTENCY CHECKS
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F30D}  Cross-platform consistency");

test("Output contains no locale-dependent characters", function () {
  // Ensure we never get a period as thousands separator (European locale)
  var result = rupx.format(1000000);
  assert.strictEqual(result, "10,00,000");
  // Should use comma as grouping separator, not period or space
  assert.ok(result.indexOf(".") === -1, "No period in integer formatting");
});

test("₹ symbol is consistently U+20B9 (Indian Rupee Sign)", function () {
  var result = rupx.formatWithSymbol(100);
  var rupeChar = result.charAt(0);
  assert.strictEqual(rupeChar, "\u20B9");
  assert.strictEqual(rupeChar.codePointAt(0), 8377);
});

test("All functions return string type", function () {
  assert.strictEqual(typeof rupx.format(100), "string");
  assert.strictEqual(typeof rupx.formatWithSymbol(100), "string");
  assert.strictEqual(typeof rupx.toWords(100), "string");
  assert.strictEqual(typeof rupx.lakhs(100000), "string");
  assert.strictEqual(typeof rupx.crores(10000000), "string");
});

test("format result never contains spaces", function () {
  var result = rupx.format(1234567890);
  assert.strictEqual(result.indexOf(" "), -1);
});

test("toWords result never has double spaces", function () {
  var result = rupx.toWords(1234567);
  assert.strictEqual(result.indexOf("  "), -1, "Found double space in: " + result);
});

test("toWords result never starts or ends with space", function () {
  var result = rupx.toWords(100);
  assert.strictEqual(result, result.trim());
});

// ═════════════════════════════════════════════════════════════════════════════
//  10. BOUNDARY & STRESS TESTS
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n\u{1F4AA}  Boundary & stress tests");

test("format(1) through format(9) — all single digits", function () {
  for (var i = 1; i <= 9; i++) {
    assert.strictEqual(rupx.format(i), String(i));
  }
});

test("toWords covers all teens correctly (10–19)", function () {
  var expected = [
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  for (var i = 0; i < expected.length; i++) {
    assert.strictEqual(rupx.toWords(10 + i), expected[i] + " Rupees");
  }
});

test("toWords covers all tens correctly (20, 30, ..., 90)", function () {
  var expected = ["Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  for (var i = 0; i < expected.length; i++) {
    assert.strictEqual(rupx.toWords((i + 2) * 10), expected[i] + " Rupees");
  }
});

test("Multiple crores: toWords(50000000) → 'Five Crore Rupees'", function () {
  assert.strictEqual(rupx.toWords(50000000), "Five Crore Rupees");
});

test("Multiple crores with remainder: toWords(50050050)", function () {
  assert.strictEqual(
    rupx.toWords(50050050),
    "Five Crore Fifty Thousand Fifty Rupees"
  );
});

test("Large crore: toWords(99999999)", function () {
  assert.strictEqual(
    rupx.toWords(99999999),
    "Nine Crore Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine Rupees"
  );
});

test("Idempotency: format(format(x)) works (nested string input)", function () {
  // format returns "1,00,000" which is not a valid numeric string for Number()
  // so this SHOULD throw - verifying it handles gracefully
  expectThrows(function () { rupx.format(rupx.format(100000)); }, TypeError);
});

// ═════════════════════════════════════════════════════════════════════════════
//  SUMMARY
// ═════════════════════════════════════════════════════════════════════════════

console.log("\n" + "\u2500".repeat(60));
if (failed === 0) {
  console.log("  \u2705 ALL " + passed + " TESTS PASSED");
} else {
  console.log("  Total: " + (passed + failed) + "  |  \u2705 Passed: " + passed + "  |  \u274C Failed: " + failed);
  console.log("");
  failures.forEach(function (f) {
    console.log("  FAIL: " + f.description);
    console.log("        " + f.error);
  });
}
console.log("\u2500".repeat(60) + "\n");

if (failed > 0) {
  process.exit(1);
}
