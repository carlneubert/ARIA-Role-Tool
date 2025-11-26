# ARIA Guidance Tool

<p align="left">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
  <img alt="Accessibility Focused" src="https://img.shields.io/badge/Accessibility-Checked-blue.svg" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES6+-orange.svg" />
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/carlneubert/ARIA-Role-Tool?style=social" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/carlneubert/ARIA-Role-Tool" />
  <img alt="Open issues" src="https://img.shields.io/github/issues/carlneubert/ARIA-Role-Tool" />
  <img alt="Open pull requests" src="https://img.shields.io/github/issues-pr/carlneubert/ARIA-Role-Tool" />
  <img alt="Built with love" src="https://img.shields.io/badge/Built%20with-%E2%9D%A4-ff69b4.svg" />
  <img alt="WAI-ARIA focused" src="https://img.shields.io/badge/WAI--ARIA-focused-blueviolet" />
</p>

---

## 🏗 Developer Architecture Overview

Now that the ARIA logic has been separated into multiple dedicated files, the tool is organized into clear, maintainable layers:

### **1. Reference Data (static)**
All ARIA role metadata, state/attribute rules, and parent/child role relationships now live in:
```
/aria-data.js
```
This file exposes global constants such as:
- `ARIA_ROLES`
- `ARIA_STATE_HINTS`
- `ROLE_REQUIRED_ARIA`
- `ROLE_DISCOURAGED_ARIA`

### **2. Pure Logic Modules**
ARIA logic has been broken into a dedicated file:
```
/aria-logic.js
```
This file contains only pure functions and no DOM access. Newly organized logic groups include:

- `AriaParse` – extracting attributes, detecting implicit roles
- `AriaChecks` – smell detection, role/state validation, structural checks
- `AriaFixes` – autofix routines + change log tracking

These functions are safe to reuse, test, or further split into multiple files.

### **3. UI Layer**
The UI wiring now lives in:
```
/script.js
```
This layer handles:
- Rendering detected roles, ARIA issues, and states
- Highlighting snippets
- Copy‑to‑clipboard behavior
- The accordion change log
- Theme toggling
- Keyboard‑accessible UI behavior

This file does *not* contain ARIA logic anymore.


---

## 📝 Contributor Notes

If you're contributing to this project or extending its features, keep in mind:

### **1. No ARIA logic belongs in `script.js`**
All ARIA‑specific logic must live inside:
- `/aria-data.js`
- `/aria-logic.js` (or its future submodules)

`script.js` should only orchestrate:
- UI updates
- highlight logic
- events
- theme interactions
- clipboard and accordion behavior

### **2. Pure functions stay pure**
Anything in `aria-logic.js` must:
- Accept input, return output  
- Avoid reading or modifying the DOM  
- Avoid mutating global state (`lastFixLog` is the only exception)

This keeps the system testable and predictable.

### **3. When adding new ARIA rules**
Add reference rules to:
- `ARIA_ROLES`  
- `ARIA_STATE_HINTS`
- `ROLE_REQUIRED_ARIA`
- `ROLE_DISCOURAGED_ARIA`

Add new detection logic to:
- `AriaChecks` namespace

Add autofixes (if safe!) to:
- `AriaFixes`

### **4. If splitting into more modules**
We will eventually break `aria-logic.js` into:

```
/aria-parse.js     // structural + attribute extraction
/aria-checks.js    // smell detection + semantic validation
/aria-fixes.js     // autofix behavior
```

These namespaces already exist and can be moved file‑by‑file when ready.

---

## 🧭 Architecture Diagram

Below is a simple high‑level diagram showing how pieces interact:

```
                 ┌─────────────────────┐
                 │     aria-data.js    │
                 │  Static ARIA rules  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    aria-logic.js    │
                 │  AriaParse          │
                 │  AriaChecks         │
                 │  AriaFixes          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      script.js      │
                 │  UI rendering       │
                 │  highlighting       │
                 │  events + theme     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      index.html     │
                 │   User Interface    │
                 └─────────────────────┘
```

This diagram reflects the flow:
- Data → Logic → UI → User

---
