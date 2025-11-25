# ARIA Role Helper – Developer Notes

This project is a small in-browser tool that analyzes custom components, detects ARIA roles, ARIA states, missing semantics, and potential accessibility issues. It also automatically generates “fixed code” and includes a change log of what was corrected.

---

## 🚀 Features

### **1. Role Detection**
Parses pasted HTML and identifies:
- Explicit `role=""` attributes
- Implicit roles based on semantic HTML
- Missing or incorrect roles

### **2. ARIA State Detection**
Highlights when ARIA states are:
- Missing (e.g., `aria-checked` on switches/checkboxes)
- Incorrectly used
- Applied on the wrong type of element

### **3. Suggested Roles**
If a custom component lacks a role, the tool suggests appropriate ones based on:
- Detected interaction patterns
- MDN role reference mapping
- The structure of the component

### **4. Automatic Code Fixing**
The “Fixed code (preview)” section automatically:
- Removes redundant roles (`<button role="button">`)
- Adds missing ARIA states (e.g., `aria-checked` for `role="switch"`)
- Adds default `aria-valuemin`, `aria-valuemax`, `aria-valuenow` for sliders/spinbuttons
- (More fixers can be added over time)

### **5. Change Log**
Every automatic fix is recorded and shown as a bulleted list so users understand what was changed and why.

### **6. Accessibility-Focused UI**
- Keyboard-accessible interactions
- High-contrast color modes
- Light/dark theme toggle

---

## 🧩 File Structure

```
/Role Site
│── index.html
│── style.css
│── script.js
│── readme.txt        ← this file
```

---

## 🌗 Light/Dark Mode

Light/dark mode is handled via:
- CSS custom properties
- Theme toggling via JavaScript
- Ensuring body text swaps properly using `var(--text)` and `var(--text-muted)`

---

## 🛠 Adding New Fixers

The fixer logic lives inside:

```
function generateFixedCode()
```

You can add more fixers such as:
- auto-adding `aria-expanded`
- flagging invalid child roles
- enforcing valid parent/child role relationships

Each fixer should also push an entry into:

```
lastFixLog
```

so the user can see the resulting change.

### 🔧 Recently Added Fixers

#### **1. Smart Tablist Auto‑Fix**
A new structural fixer was added that detects when an element contains one or more children with `role="tab"` but does **not** itself declare a role. In these cases, the tool now:
- Automatically adds `role="tablist"` to the wrapping element
- Records the change in the change log
- Ensures the ARIA tab/tabpanel pattern is more correctly modeled

This upgrade allows the tool to intelligently promote containers that behave like tablists without requiring developers to manually add the role.

#### **2. Show Fixed Code Only When Fixes Exist**
Previously, the “Fixed code (preview)” panel always appeared—even when no modifications were made. This was confusing for users.

Current behavior:
- If **no fixes** were applied, the tool now shows a simple message:
  > *“No automatic fixes were applied…”*
- The fixed code block and copy‑to‑clipboard button are hidden
- If **fixes do exist**, the full preview, GitHub‑style copy button, and change log accordion are displayed

This makes the output more intuitive and reinforces when the autofixer actually made improvements.

---

## 🧪 Testing

Test snippets you can use:

```
<button role="button">Click</button>
```

```
<div role="switch">Dark mode</div>
```

```
<div role="slider">Volume</div>
```

```
<div>
  <span role="tab">Tab 1</span>
  <div role="tabpanel"></div>
</div>
```

---

## 🧪 Regression Test Suite

Use these snippets to verify that role detection, ARIA state detection, suggested roles, automatic fixing, change logs, and UI rendering continue to work after refactoring.

### **A. Redundant Roles & Basic Fixers**
```
<button role="button">Save</button>

<div role="switch" id="dark-toggle">Dark mode</div>

<div role="checkbox" id="opt-in">Email updates</div>

<div role="slider" id="volume">Volume</div>

<nav role="navigation">
  <a href="/" role="link">Home</a>
</nav>
```

### **B. Implicit vs Explicit Role Suggestions**
```
<button type="button">Click me</button>
```
```
<div role="tab">Overview</div>
```

### **C. Structural Smells (Parent/Child Roles)**
```
<div role="tab">Overview</div>
<div role="tabpanel">Overview panel</div>
```
```
<div role="menuitem">Item 1</div>
<div role="menuitem">Item 2</div>
```

### **D. ARIA State Pairing**
```
<div role="switch" aria-expanded="true">Toggle</div>
```
```
<div role="slider" aria-valuemin="10">Volume</div>
```

### **E. Custom Interactive Component**
```
<div class="btn" onclick="save()">Save changes</div>
```

### **F. Light/Dark Mode Visual Check**
```
<button type="button">Click me</button>
<div role="switch" aria-checked="true">Dark mode</div>
<div role="slider" aria-valuemin="0" aria-valuemax="10" aria-valuenow="7">Volume</div>
```

This suite ensures coverage of redundant roles, ARIA state fixes, structural warnings, implicit/explicit role mapping, light/dark mode styling, and corrected code generation.

---

## 👨‍💻 Author

Created by **Carl Neubert**  
Role helper tool for experimenting with ARIA, accessibility smell checking, and auto-correction.

---


---

## 🧭 Roadmap

Planned enhancements for future versions of the ARIA Role Helper:

### **🔹 Additional Fixers**
- ✓ Auto-add `role="tablist"` when wrapping elements with `role="tab"`
- ✓ Only show fixed code when actual autofixes were applied
- Auto-add `aria-expanded` based on detected disclosure patterns  
- Normalize `aria-pressed` usage on toggle buttons  
- Validate required child roles (`tab` → `tabpanel`, `listbox` → `option`, etc.)  
- Identify invalid parent/child combinations based on ARIA spec  
- Add support for landmark role suggestions (e.g., `banner`, `contentinfo`, `main`)  

### **🔹 Smarter Role Suggestions**
- ✓ Improved structural detection for tab/tabpanel relationships
- Detect whether the component behaves like a button, toggle, or menu trigger  
- Analyze text content and event attributes (e.g., `onclick`, keyboard handlers)  
- Provide multiple suggested roles when appropriate

### **🔹 Advanced Analysis**
- Flag incorrect state-role pairs  
- Suggest semantic HTML alternatives before ARIA roles  
- Warn about keyboard accessibility pitfalls

### **🔹 UI Improvements**
- Collapsible panels  
- Ability to download the fixed code  
- Optional “verbose mode” to show deeper rule explanations  
- Code diff view between original and fixed snippet

---

## 🧑‍🤝‍🧑 Contributor Notes

If you want to extend this tool:

1. All ARIA logic lives inside `script.js`  
2. The key functions to understand are:
   - `detectRoles()`
   - `detectSmells()`
   - `detectStates()`
   - `generateRoleSuggestions()`
   - **`generateFixedCode()` ← most fixer logic lives here**
3. When adding a new auto-fix:
   - Insert logic inside `generateFixedCode()`
   - Push human-readable explanations into `lastFixLog`
   - Ensure the UI surfaces the new fix cleanly

Please keep contributions:
- Focused on usability  
- WCAG & ARIA-compliant  
- Transparent about what is auto-modified

---

## 🔗 Useful MDN References

- ARIA roles list: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles  
- ARIA states & properties: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes  
- Keyboard accessibility patterns: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets  
- Native HTML semantics guide: https://developer.mozilla.org/en-US/docs/Web/HTML/Element  


This README will continue evolving as new features and fixers are added.
