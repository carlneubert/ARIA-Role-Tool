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

## 👨‍💻 Author

Created by **Carl Neubert**  
Role helper tool for experimenting with ARIA, accessibility smell checking, and auto-correction.

---


---

## 🧭 Roadmap

Planned enhancements for future versions of the ARIA Role Helper:

### **🔹 Additional Fixers**
- Auto-add `aria-expanded` based on detected disclosure patterns  
- Normalize `aria-pressed` usage on toggle buttons  
- Validate required child roles (`tab` → `tabpanel`, `listbox` → `option`, etc.)  
- Identify invalid parent/child combinations based on ARIA spec  
- Add support for landmark role suggestions (e.g., `banner`, `contentinfo`, `main`)  

### **🔹 Smarter Role Suggestions**
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

