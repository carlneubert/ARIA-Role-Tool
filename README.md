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

This modular breakdown makes the project easier to maintain, test, and extend as more ARIA rules or fixers are added.
