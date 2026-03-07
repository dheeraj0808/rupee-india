# rupee-india

> 🇮🇳 A lightweight, zero-dependency Indian Rupee formatter for Node.js

Format numbers using the **Indian numbering system** (thousand, lakh, crore), convert amounts to words, and display with the ₹ symbol — all without any external dependencies.

[![npm version](https://img.shields.io/npm/v/rupee-india.svg)](https://www.npmjs.com/package/rupee-india)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-brightgreen.svg)](https://nodejs.org)

---

## ✨ Features

- 🔢 **Indian comma grouping** — formats numbers as `1,00,000` instead of `100,000`
- 💰 **Rupee symbol** — prefix with ₹ in one call
- 🗣️ **Number to words** — `"One Lakh Rupees"` with paise support
- 📊 **Lakh / Crore helpers** — express values in lakh or crore units
- ⚡ **Zero dependencies** — lightweight and fast
- 🛡️ **Input validation** — descriptive errors for invalid input
- 🧩 **CommonJS** — works with `require()` out of the box (Node.js 16+)

---

## Installation

```bash
npm install rupee-india
```

---

## Quick Start

```javascript
const rupee = require("rupee-india");

rupee.format(1000000);           // "10,00,000"
rupee.formatWithSymbol(50000);   // "₹50,000"
rupee.toWords(1250);             // "One Thousand Two Hundred Fifty Rupees"
rupee.lakhs(1000000);            // "10 Lakh"
rupee.crores(10000000);          // "1 Crore"
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
rupee.format(1000);        // "1,000"
rupee.format(100000);      // "1,00,000"
rupee.format(10000000);    // "1,00,00,000"
rupee.format(1234567890);  // "1,23,45,67,890"
rupee.format(-50000);      // "-50,000"
rupee.format(1234.56);     // "1,234.56"
rupee.format("100000");    // "1,00,000"  (string input)
```

---

### `formatWithSymbol(number)`

Same as `format()` but prefixed with the **₹** Rupee symbol.

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to format |

**Returns:** `string` — formatted number with ₹ prefix.

```javascript
rupee.formatWithSymbol(100000);   // "₹1,00,000"
rupee.formatWithSymbol(0);        // "₹0"
rupee.formatWithSymbol(-500);     // "-₹500"
rupee.formatWithSymbol(10000000); // "₹1,00,00,000"
```

---

### `toWords(number)`

Converts a number to **Indian-English currency words**. Supports paise (up to 2 decimal places) and negative numbers.

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to convert |

**Returns:** `string` — human-readable currency string.

```javascript
rupee.toWords(0);          // "Zero Rupees"
rupee.toWords(1500);       // "One Thousand Five Hundred Rupees"
rupee.toWords(100000);     // "One Lakh Rupees"
rupee.toWords(10000000);   // "One Crore Rupees"
rupee.toWords(1234567);    // "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Rupees"
rupee.toWords(21.50);      // "Twenty One Rupees and Fifty Paise"
rupee.toWords(-500);       // "Minus Five Hundred Rupees"
```

---

### `lakhs(number)`

Express a number in **Lakh** units (1 Lakh = 1,00,000).

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to convert |

**Returns:** `string` — value in lakhs with label.

```javascript
rupee.lakhs(100000);   // "1 Lakh"
rupee.lakhs(1000000);  // "10 Lakh"
rupee.lakhs(250000);   // "2.5 Lakh"
rupee.lakhs(50000);    // "0.5 Lakh"
```

---

### `crores(number)`

Express a number in **Crore** units (1 Crore = 1,00,00,000).

| Parameter | Type | Description |
|-----------|------|-------------|
| `number` | `number \| string` | The number to convert |

**Returns:** `string` — value in crores with label.

```javascript
rupee.crores(10000000);   // "1 Crore"
rupee.crores(100000000);  // "10 Crore"
rupee.crores(75000000);   // "7.5 Crore"
```

---

## Error Handling

All functions validate their input and throw descriptive errors:

```javascript
rupee.format("abc");       // TypeError: Expected a number ...
rupee.format(Infinity);    // RangeError: Number must be finite ...
rupee.format(null);        // TypeError: Expected a number ...
rupee.format(undefined);   // TypeError: Expected a number ...
```

---

## Running Tests

```bash
npm test
```

---

## Project Structure

```
rupee-india/
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

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/dheeraj0808/package).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## Author

**Dheeraj Singh** — [GitHub](https://github.com/dheeraj0808)

## License

[MIT](LICENSE) © 2026 Dheeraj Singh
