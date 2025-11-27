# ARIA Guidance Tool

<p align="left">
  <img alt="Version 0.3.0" src="https://img.shields.io/badge/version-0.3.0-blue.svg" />
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

## 🌟 Overview
The **ARIA Guidance Tool** helps developers debug, validate, and improve accessibility by analyzing HTML snippets for:

- Incorrect or misused ARIA roles
- Invalid ARIA states or values
- Missing required ARIA attributes
- Orphaned or structurally incorrect composite widgets
- Redundant ARIA on semantic HTML
- Accessible name issues
- Missing or misapplied interactive semantics

It also provides:
- Suggested correct roles based on element behavior
- Autofixed versions of your snippet
- A human‑readable change log
- Direct MDN links for each ARIA attribute

Paste code → Get guidance → Improve accessibility.

---

## 🚀 Live Demo
**Coming soon:** GitHub Pages deployment.

---

## ✨ Features
- 🔍 **Automatic ARIA role detection**
- 🔧 **Autofix suggestions** with highlighted changes
- 🧭 **Full change log** explaining what was fixed and why
- 📘 **Per‑ARIA MDN links**
- 🎯 **Composite widget validation** (tabs, menus, listboxes, dialogs, trees, etc.)
- 🌗 **Light & Dark Mode** with accessible contrast tokens
- 🧩 **Semantic validation** (detects redundant or incorrect usage)
- 🧠 **Accessible name analysis** (aria-label/labelledby rules)
- 📋 **GitHub‑style copy button** for fixed code output
- ♿ Fully keyboard navigable UI

---

## 📦 Installation (Optional for Devs)
You can clone the project locally:

```
git clone https://github.com/carlneubert/ARIA-Role-Tool.git
cd ARIA-Role-Tool
```

Open `index.html` in a browser.

---

## 💡 How It Works
The tool analyzes your snippet in three phases:

### **1. Parsing**
- Extracts roles, states, and all attributes
- Determines implicit roles from native HTML
- Detects composite widget structures

### **2. Validation**
Checks against rule sets:
- Required states
- Disallowed states
- Structural parent/child requirements
- Missing accessible names
- Redundant or illegal ARIA

### **3. Autofix**
Safely applies improvements:
- Removes redundant roles
- Adds missing required ARIA attributes
- Corrects invalid boolean values
- Inserts missing composite container roles
- Builds a full change log of what was corrected

---

## 📘 Example
Paste this:

```html
<button role="button" aria-pressed="maybe">Save</button>
```

You’ll get:
- A warning that `role="button"` is redundant
- An error that `aria-pressed="maybe"` is invalid
- A fixed snippet:

```html
<button aria-pressed="false">Save</button>
```

And a change log explaining both corrections.

---

## 🏗 Developer Architecture Overview
The tool follows a clear 3‑layer structure:

### **1. Reference Data (static)**
```
/aria-data.js
```
Contains:
- `ARIA_ROLES`
- `ARIA_STATE_HINTS`
- `ROLE_REQUIRED_ARIA`
- `ROLE_DISCOURAGED_ARIA`

### **2. Pure Logic Modules**
```
/aria-logic.js
```
Contains namespaces:
- `AriaParse`
- `AriaChecks`
- `AriaFixes`

No DOM access. Fully testable.

### **3. UI Layer**
```
/script.js
```
Handles:
- State/role rendering
- Highlighting
- Accordion
- Theme toggle
- Copy button

---

## 🧭 Architecture Diagram
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

---

## 🤝 Contributing
See `CONTRIBUTING.md` for full guidelines.

We welcome:
- ARIA rule contributions
- UI improvements
- Bug reports
- New feature ideas

---

## 📜 Changelog
See [`CHANGELOG.md`](./CHANGELOG.md)

---

## 📄 License
This project is licensed under the MIT License.

---

## ❤️ Acknowledgements
Thanks to the accessibility community for continually pushing the web toward inclusive design.
