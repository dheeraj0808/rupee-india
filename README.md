# rupx

> 🇮🇳 A lightweight, zero-dependency Indian Rupee formatter for Node.js

Format numbers using the **Indian numbering system** (thousand, lakh, crore), convert amounts to words, and display with the ₹ symbol — all without any external dependencies.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-brightgreen.svg)](https://nodejs.org)

---

## Installation

```bash
npm install rupx
```

## Quick Start

```javascript
const rupx = require("rupx");

rupx.format(1000000);           // "10,00,000"
rupx.formatWithSymbol(50000);   // "₹50,000"
rupx.toWords(1250);             // "One Thousand Two Hundred Fifty Rupees"
rupx.lakhs(1000000);            // "10 Lakh"
rupx.crores(10000000);          // "1 Crore"
```

---

## API Reference

### `format(number)`

Converts a number to a string with **Indian comma grouping** (groups of 3 then 2 from the right).

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to format |

**Returns:** `string` — comma-formatted number.

```javascript
rupx.format(1000);        // "1,000"
rupx.format(100000);      // "1,00,000"
rupx.format(10000000);    // "1,00,00,000"
rupx.format(1234567890);  // "1,23,45,67,890"
rupx.format(-50000);      // "-50,000"
rupx.format(1234.56);     // "1,234.56"
rupx.format("100000");    // "1,00,000"  (string input)
```

---

### `formatWithSymbol(number)`

Same as `format()` but prefixed with the **₹** Rupee symbol.

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to format |

**Returns:** `string` — formatted number with ₹ prefix.

```javascript
rupx.formatWithSymbol(100000);   // "₹1,00,000"
rupx.formatWithSymbol(0);        // "₹0"
rupx.formatWithSymbol(-500);     // "-₹500"
rupx.formatWithSymbol(10000000); // "₹1,00,00,000"
```

---

### `toWords(number)`

Converts a number to **Indian-English currency words**. Supports paise (up to 2 decimal places) and negative numbers.

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to convert |

**Returns:** `string` — human-readable currency string.

```javascript
rupx.toWords(0);          // "Zero Rupees"
rupx.toWords(1500);       // "One Thousand Five Hundred Rupees"
rupx.toWords(100000);     // "One Lakh Rupees"
rupx.toWords(10000000);   // "One Crore Rupees"
rupx.toWords(1234567);    // "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Rupees"
rupx.toWords(21.50);      // "Twenty One Rupees and Fifty Paise"
rupx.toWords(-500);       // "Minus Five Hundred Rupees"
```

---

### `lakhs(number)`

Express a number in **Lakh** units (1 Lakh = 1,00,000).

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to convert |

**Returns:** `string` — value in lakhs with label.

```javascript
rupx.lakhs(100000);   // "1 Lakh"
rupx.lakhs(1000000);  // "10 Lakh"
rupx.lakhs(250000);   // "2.5 Lakh"
rupx.lakhs(50000);    // "0.5 Lakh"
```

---

### `crores(number)`

Express a number in **Crore** units (1 Crore = 1,00,00,000).

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to convert |

**Returns:** `string` — value in crores with label.

```javascript
rupx.crores(10000000);   // "1 Crore"
rupx.crores(100000000);  // "10 Crore"
rupx.crores(75000000);   // "7.5 Crore"
```

---

## Error Handling

All functions validate their input and throw descriptive errors:

```javascript
rupx.format("abc");       // TypeError: Expected a number ...
rupx.format(Infinity);    // RangeError: Number must be finite ...
rupx.format(null);        // TypeError: Expected a number ...
rupx.format(undefined);   // TypeError: Expected a number ...
```

## Running Tests

```bash
npm test
```

## Project Structure

```
rupx/
├── package.json
├── README.md
├── LICENSE
├── index.js          # Main entry point — re-exports all functions
├── src/
│   ├── format.js     # format, formatWithSymbol, lakhs, crores
│   ├── words.js      # toWords (number → Indian-English currency words)
│   └── helpers.js    # Input validation & shared utilities
└── test/
    └── test.js       # Comprehensive test suite
```

## License

[MIT](LICENSE) © 2026
