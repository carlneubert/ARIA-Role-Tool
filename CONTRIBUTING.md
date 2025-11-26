

# Contributing to the ARIA Role & State Helper Tool

Thank you for your interest in contributing! This project aims to help developers correctly use ARIA roles, states, and properties by analyzing snippet input, surfacing issues, and offering safe autofixes.  
To keep the code maintainable and consistent, please read the guidelines below before submitting changes.

---

## 🧱 Project Structure

This project is intentionally modular to separate concerns clearly:

```
/aria-data.js      → Static ARIA reference data (roles, states, required/forbidden attributes)
/aria-logic.js     → ARIA parsing, validation, smell detection, and autofix logic
/script.js         → UI logic only (no ARIA rules belong here)
/style.css         → Styling for the tool
/index.html        → App layout and structure
```

The goal is to keep `/script.js` free of ARIA-related logic so that all accessibility rules live in one dedicated module.

---

## 🧠 Coding Guidelines

### 1. Keep ARIA logic pure  
All functions in `aria-logic.js` should:

- Accept input → return output  
- Avoid touching DOM APIs  
- Avoid side effects  
- Not mutate arguments  
- Not depend on UI state  
- Only read the global ARIA reference objects from `aria-data.js`

The **only allowed global mutation** is updating the `lastFixLog` array inside autofix functions.

---

### 2. When adding new ARIA rules

If you're extending support for new ARIA roles, states, or required attribute rules:

#### Add data in:
- `ARIA_ROLES`
- `ARIA_STATE_HINTS`
- `ROLE_REQUIRED_ARIA`
- `ROLE_DISCOURAGED_ARIA`

#### Add behavior in:
- `AriaChecks` (for new smells / validations)
- `AriaFixes` (only if an autofix is safe)
- `AriaParse` (only if parsing behavior changes)

Avoid adding conditional logic directly in `detectSmells()` or `generateFixedCode()`—delegate work to helper functions.

---

### 3. UI Contributions

UI logic and rendering belong in `/script.js`.  
If you modify UI behavior, ensure:

- All interactive elements receive correct keyboard focus
- Light/dark mode continues to meet WCAG contrast
- Buttons and links do not introduce semantic misuse
- No ARIA attributes are added to UI components unnecessarily

---

### 4. Performance Considerations

When possible:

- Prefer `matchAll()` to repeated regex scans
- Avoid deeply nested regex passes
- Cache repeated selectors or regex patterns
- Keep DOM updates small and batched

The tool should remain fast even with very large pasted code snippets.

---

## 🔍 Running Tests (future)

This project will eventually include a lightweight browser-based test harness.  
Once added, contributors will be able to run:

```
npm run test
```

(If you see this section, tests haven’t been added yet—but the structure is ready.)

---

## 🔀 Pull Request Process

1. Fork the project  
2. Create a feature branch (e.g., `feature/add-new-aria-rule`)  
3. Make your changes following the guidelines  
4. Ensure your code passes manual smoke tests  
5. Submit a pull request  
6. The pull request will be reviewed for:
   - Clarity
   - Maintainability
   - Accessibility correctness
   - Consistency with project philosophy

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

## 🙌 Thank You

Every contribution—large or small—helps make the web more accessible for everyone.  
Thank you for helping improve this tool!