// -----------------------------------------------------------------------------
// ARIA Role Tool — ARIA Logic (Pure Functions)
// -----------------------------------------------------------------------------
// This file contains the pure logic for:
// - Validating ARIA values
// - Extracting ARIA attributes
// - Inferring implicit roles
// - Detecting ARIA issues (“smells”)
// - Generating conservative autofixes + a change log
//
// It assumes the following globals are defined (from aria-data.js):
// - ARIA_ROLES
// - ARIA_STATE_HINTS
// - ROLE_REQUIRED_ARIA
// - ROLE_DISCOURAGED_ARIA
// -----------------------------------------------------------------------------

function isValidAriaValue(name, value) {
  const v = (value || "").toLowerCase().trim();

  switch (name) {
    case "aria-expanded":
      return v === "true" || v === "false" || v === "undefined";
    case "aria-checked":
      return v === "true" || v === "false" || v === "mixed" || v === "undefined";
    case "aria-selected":
      return v === "true" || v === "false" || v === "undefined";
    case "aria-hidden":
      return v === "true" || v === "false" || v === "undefined";
    case "aria-pressed":
      return v === "true" || v === "false" || v === "mixed" || v === "undefined";
    case "aria-modal":
      return v === "true" || v === "false";
    default:
      return true;
  }
}

function extractAriaAttributes(snippet) {
  if (!snippet) return [];
  const matches = [...snippet.matchAll(/\b(aria-[a-z0-9_-]+)\s*=\s*["']([^"']*)["']/gi)];
  return matches.map((m) => ({ name: m[1], value: m[2] }));
}

// Helper to detect implicit roles on native elements
function getImplicitRoleForTag(tagText, tagName) {
  const lower = tagText.toLowerCase();
  const name = tagName.toLowerCase();

  // Button
  if (name === "button") {
    return "button";
  }

  // Links: only when they actually have href
  if (name === "a" && /\bhref\s*=\s*["'][^"']+["']/.test(lower)) {
    return "link";
  }

  // Landmarks
  if (name === "nav") return "navigation";
  if (name === "main") return "main";
  if (name === "header") return "banner";
  if (name === "footer") return "contentinfo";

  // Lists
  if (name === "ul" || name === "ol") return "list";
  if (name === "li") return "listitem";

  // Tables
  if (name === "table") return "table";
  if (name === "tr") return "row";
  if (name === "td") return "cell";

  // Inputs
  if (name === "input") {
    const typeMatch = lower.match(/\btype\s*=\s*["']([^"']+)["']/i);
    const typeVal = (typeMatch ? typeMatch[1] : "text").toLowerCase();

    if (["button", "submit", "reset", "image"].includes(typeVal)) {
      return "button";
    }
    if (typeVal === "checkbox") return "checkbox";
    if (typeVal === "radio") return "radio";
    if (["email", "tel", "url", "text", "password", "search", "number"].includes(typeVal)) {
      return "textbox";
    }
  }

  if (name === "textarea") return "textbox";

  return null;
}

function validateAriaAgainstRoles(snippet, smells) {
  const tagRegex = /<([a-z0-9:-]+)\b[^>]*>/gi;
  let match;

  while ((match = tagRegex.exec(snippet)) !== null) {
    const tag = match[0];
    const tagLower = tag.toLowerCase();
    const tagName = match[1].toLowerCase();

    const roleMatch = tagLower.match(/\brole\s*=\s*["']([^"']+)["']/i);
    if (!roleMatch) continue;

    const roleName = (roleMatch[1] || "").trim().toLowerCase();
    const implicitRole = getImplicitRoleForTag(tag, tagName);

    // Warn when an explicit role duplicates the native implicit role
    if (implicitRole && implicitRole === roleName) {
      smells.push(
        `Native <code>&lt;${tagName}&gt;</code> already has the implicit <code>${implicitRole}</code> role. You usually don't need <code>role="${roleName}"</code> on semantic elements.`
      );
    } else if (implicitRole && implicitRole !== roleName) {
      // Warn when explicit role overrides a strong native semantic
      smells.push(
        `Native <code>&lt;${tagName}&gt;</code> has implicit role <code>${implicitRole}</code>, but an explicit <code>role="${roleName}"</code> is set. This can confuse assistive technologies; double-check that this is the intended pattern.`
      );
    }

    const ariaRegex = /\b(aria-[a-z0-9_-]+)\s*=\s*["']([^"']*)["']/gi;
    const ariaAttrs = [];
    let ariaMatch;

    while ((ariaMatch = ariaRegex.exec(tagLower)) !== null) {
      ariaAttrs.push({ name: ariaMatch[1], value: ariaMatch[2] });
    }

    const names = ariaAttrs.map((a) => a.name);

    const required = ROLE_REQUIRED_ARIA[roleName];
    if (required && required.length) {
      required.forEach((attrName) => {
        if (!names.includes(attrName)) {
          smells.push(
            `Element with <code>role="${roleName}"</code> is missing required <code>${attrName}</code>.`
          );
        }
      });
    }

    const discouraged = ROLE_DISCOURAGED_ARIA[roleName];
    if (discouraged && discouraged.length) {
      discouraged.forEach((attrName) => {
        if (names.includes(attrName)) {
          smells.push(
            `Attribute <code>${attrName}</code> is not typically used with <code>role="${roleName}"</code>. Double-check if this is the right pattern.`
          );
        }
      });
    }

    ariaAttrs.forEach((attr) => {
      if (!isValidAriaValue(attr.name, attr.value)) {
        smells.push(
          `Attribute <code>${attr.name}</code> has value <code>"${attr.value}"</code>, which is not a valid value for this ARIA attribute.`
        );
      }
    });
  }
}

function detectRoleStructureIssues(snippet, smells) {
  if (!snippet) return;

  const lower = snippet.toLowerCase();

  const hasRole = (roleName) =>
    new RegExp(`\\brole\\s*=\\s*["']${roleName}["']`).test(lower);

  const hasAnyRole = (roleNames) => roleNames.some((r) => hasRole(r));

  // Tabs: tab should usually be inside a tablist
  if (hasRole("tab") && !hasRole("tablist")) {
    smells.push(
      'Found elements with <code>role="tab"</code> but no <code>role="tablist"</code>. Tabs are usually contained in a tablist element.'
    );
  }

  // Tabpanels: should correspond to tabs
  if (hasRole("tabpanel") && !hasRole("tab")) {
    smells.push(
      'Found elements with <code>role="tabpanel"</code> but no <code>role="tab"</code>. Tabpanels are usually controlled by tabs.'
    );
  }

  // Options: should usually live inside listbox or combobox
  if (hasRole("option") && !hasAnyRole(["listbox", "combobox"])) {
    smells.push(
      'Found elements with <code>role="option"</code> but no <code>role="listbox"</code> or <code>role="combobox"</code>. Options are usually children of these composite widgets.'
    );
  }

  // Menu items: should usually live inside menu or menubar
  if (
    hasAnyRole(["menuitem", "menuitemcheckbox", "menuitemradio"]) &&
    !hasAnyRole(["menu", "menubar"])
  ) {
    smells.push(
      'Found menu item roles (such as <code>role="menuitem"</code>) but no <code>role="menu"</code> or <code>role="menubar"</code>. Menu items are usually contained in menu or menubar elements.'
    );
  }

  // Tree items: should usually live inside tree
  if (hasRole("treeitem") && !hasRole("tree")) {
    smells.push(
      'Found elements with <code>role="treeitem"</code> but no <code>role="tree"</code>. Treeitems are usually contained in a tree widget.'
    );
  }

  // Rows: should usually live inside table/grid/treegrid
  if (hasRole("row") && !hasAnyRole(["table", "grid", "treegrid"])) {
    smells.push(
      'Found elements with <code>role="row"</code> but no parent table, grid, or treegrid role in the snippet. Rows are usually part of these composite widgets.'
    );
  }

  // Cells: should usually live inside a row
  if (hasAnyRole(["cell", "gridcell"]) && !hasRole("row")) {
    smells.push(
      'Found elements with <code>role="cell"</code> or <code>role="gridcell"</code> but no <code>role="row"</code> in the snippet. Cells are usually children of rows.'
    );
  }
}

function addRoleSemanticsSmells(snippet, lower, smells) {
  const presentationalRegex =
    /<([a-z0-9:-]+)\b[^>]*\brole\s*=\s*["'](presentation|none)["'][^>]*>/gi;
  let pres;
  while ((pres = presentationalRegex.exec(snippet)) !== null) {
    const tagText = pres[0].toLowerCase();
    const tagName = pres[1].toLowerCase();
    const focusableByDefault = ["a", "button", "input", "select", "textarea"].includes(tagName);
    const hasTabindex = /\btabindex\s*=\s*["']?-?\d+["']?/.test(tagText);
    const hasHref = /\bhref\s*=\s*["'][^"']+["']/.test(tagText);
    if (focusableByDefault || hasTabindex || hasHref) {
      smells.push(
        'Focusable element is using <code>role="presentation"</code> or <code>role="none"</code>, which can hide it from assistive technologies.'
      );
      break;
    }
  }
}

function addInteractionSmells(snippet, lower, smells) {
  const clickAttrRegex =
    /<([a-z0-9:-]+)\b[^>]*\b(onclick|onmousedown|onmouseup)\s*=\s*["'][^"']*["'][^>]*>/gi;
  let clickMatch;
  while ((clickMatch = clickAttrRegex.exec(snippet)) !== null) {
    const tagName = clickMatch[1].toLowerCase();
    const tag = clickMatch[0].toLowerCase();
    const hasRoleButton = /\brole\s*=\s*["']button["']/.test(tag);
    const hasTabindex = /\btabindex\s*=\s*["']0["']/.test(tag);
    const hasKeyHandler = /\bonkey(down|up|press)\s*=/.test(tag);
    const nativeInteractive = ["a", "button", "input", "textarea", "select", "option"].includes(
      tagName
    );
    if (!nativeInteractive && !hasRoleButton && !hasTabindex && !hasKeyHandler) {
      smells.push(
        'Element has a mouse event handler but no keyboard support. Consider using a <code>&lt;button&gt;</code> or adding keyboard handlers and <code>tabindex="0"</code>.'
      );
      break;
    }
  }

  const expandedRegex =
    /<([a-z0-9:-]+)\b[^>]*\baria-expanded\s*=\s*["'](true|false)["'][^>]*>/gi;
  let expandedMatch;
  while ((expandedMatch = expandedRegex.exec(snippet)) !== null) {
    const tagLower = expandedMatch[0].toLowerCase();
    const hasControls = /\baria-controls\s*=\s*["'][^"']+["']/.test(tagLower);
    if (!hasControls) {
      smells.push(
        'Element uses <code>aria-expanded</code> without a matching <code>aria-controls</code>. Consider referencing the ID of the collapsible content with <code>aria-controls</code>.'
      );
      break;
    }
  }

  const tabExpandedRegex =
    /<([a-z0-9:-]+)\b[^>]*\brole\s*=\s*["']tab["'][^>]*\baria-expanded\s*=\s*["'](true|false)["'][^>]*>/gi;
  if (tabExpandedRegex.test(snippet)) {
    smells.push(
      'Found <code>aria-expanded</code> on an element with <code>role="tab"</code>. Tabs usually use <code>aria-selected</code> to indicate the active tab.'
    );
  }

  if (
    /\brole\s*=\s*["']dialog["']/.test(lower) &&
    !/\baria-modal\s*=\s*["'](true|false)["']/.test(lower)
  ) {
    smells.push(
      'Dialog found without <code>aria-modal</code>. If this is a modal dialog, consider <code>aria-modal="true"</code> and managing focus.'
    );
  }

  if (
    /\brole\s*=\s*["']switch["']/.test(lower) &&
    !/\baria-checked\s*=\s*["'](true|false)["']/.test(lower)
  ) {
    smells.push(
      'Element with <code>role="switch"</code> is missing <code>aria-checked</code>. Switches should expose their on/off state.'
    );
  }
}

function addAccessibleNameSmells(snippet, smells) {
  const tagRegex = /<([a-z0-9:-]+)\b[^>]*>/gi;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(snippet)) !== null) {
    const tagText = tagMatch[0];
    const tagName = tagMatch[1].toLowerCase();
    const lowerTag = tagText.toLowerCase();

    const hasAriaLabel = /\baria-label\s*=\s*["'][^"']*["']/.test(lowerTag);
    const hasAriaLabelledby = /\baria-labelledby\s*=\s*["'][^"']*["']/.test(lowerTag);
    if (!hasAriaLabel && !hasAriaLabelledby) continue;

    const hasExplicitRole = /\brole\s*=\s*["'][^"']*["']/.test(lowerTag);
    const implicit = getImplicitRoleForTag(tagText, tagName);

    if (!hasExplicitRole && !implicit) {
      smells.push(
        `Element <code>&lt;${tagName}&gt;</code> has <code>aria-label</code> or <code>aria-labelledby</code> but no semantic role. Consider adding a role or using a native element (for example, <code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>, or <code>&lt;main&gt;</code>).`
      );
    }

    if (hasAriaLabel && hasAriaLabelledby) {
      smells.push(
        `Element <code>&lt;${tagName}&gt;</code> uses <code>aria-label</code> and <code>aria-labelledby</code> together. Elements should have a single accessible name source; choose one.`
      );
    }
  }

  const emptyAriaRegex = /\b(aria-label|aria-labelledby)\s*=\s*["']\s*["']/gi;
  let emptyMatch;
  while ((emptyMatch = emptyAriaRegex.exec(snippet)) !== null) {
    const attrName = emptyMatch[1];
    smells.push(
      `Attribute <code>${attrName}</code> is present but empty. Elements should not use an empty accessible name; provide meaningful text or remove the attribute.`
    );
  }

  const buttonRegex = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
  let buttonMatch;
  while ((buttonMatch = buttonRegex.exec(snippet)) !== null) {
    const attrs = buttonMatch[1] || "";
    const inner = buttonMatch[2] || "";
    const attrsLower = attrs.toLowerCase();

    const hasAriaLabel = /\baria-label\s*=\s*["'][^"']*["']/.test(attrsLower);
    const hasAriaLabelledby = /\baria-labelledby\s*=\s*["'][^"']*["']/.test(attrsLower);
    const hasTitle = /\btitle\s*=\s*["'][^"']*["']/.test(attrsLower);

    const innerWithoutTags = inner.replace(/<[^>]+>/g, "");
    const innerText = innerWithoutTags.replace(/\s+/g, "");
    const hasVisibleText = innerText.length > 0;

    if (!hasVisibleText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      smells.push(
        'Native <code>&lt;button&gt;</code> does not have an accessible name. Add visible text inside the button, or use <code>aria-label</code>, <code>aria-labelledby</code>, or <code>title</code>.'
      );
    }
  }

  const interactiveTagRegex = /<([a-z0-9:-]+)\b[^>]*>/gi;
  let interactiveMatch;
  const interactiveRolesNeedingName = [
    "button",
    "link",
    "switch",
    "checkbox",
    "radio",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "tab",
    "option"
  ];

  while ((interactiveMatch = interactiveTagRegex.exec(snippet)) !== null) {
    const tagText = interactiveMatch[0];
    const tagName = interactiveMatch[1].toLowerCase();
    const lowerTag = tagText.toLowerCase();

    const roleMatch = lowerTag.match(/\brole\s*=\s*["']([^"']+)["']/i);
    if (!roleMatch) continue;

    const roleName = (roleMatch[1] || "").trim().toLowerCase();
    if (!interactiveRolesNeedingName.includes(roleName)) continue;

    const nativeInteractiveTags = ["button", "a", "input", "textarea", "select", "option"];
    if (nativeInteractiveTags.includes(tagName)) continue;

    const hasAriaLabel = /\baria-label\s*=\s*["'][^"']*["']/.test(lowerTag);
    const hasAriaLabelledby = /\baria-labelledby\s*=\s*["'][^"']*["']/.test(lowerTag);
    const hasTitle = /\btitle\s*=\s*["'][^"']*["']/.test(lowerTag);

    if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      smells.push(
        `Interactive element <code>&lt;${tagName}&gt;</code> with <code>role="${roleName}"</code> does not have an accessible name. Add visible text, <code>aria-label</code>, or <code>aria-labelledby</code>.`
      );
    }
  }
}

function detectSmells(snippet) {
  const smells = [];
  if (!snippet) return smells;

  const lower = snippet.toLowerCase();

  addRoleSemanticsSmells(snippet, lower, smells);
  addInteractionSmells(snippet, lower, smells);
  addAccessibleNameSmells(snippet, smells);

  validateAriaAgainstRoles(snippet, smells);
  detectRoleStructureIssues(snippet, smells);

  return smells;
}

// Store the most recent fix log globally
let lastFixLog = [];

// Attempts conservative autofixes such as removing redundant roles,
// adding missing required ARIA attributes, and repairing simple structure.
// Also writes human-readable fix descriptions into lastFixLog.
function generateFixedCode(snippet) {
  if (!snippet) {
    lastFixLog = [];
    return "";
  }

  const changes = [];

  // First pass: remove redundant role attributes when they duplicate the implicit role
  let fixed = snippet.replace(/<([a-z0-9:-]+)\b([^>]*)>/gi, (full, tagName, attrs) => {
    const tagText = full;
    const implicit = getImplicitRoleForTag(tagText, tagName);
    if (!implicit) return full;

    const roleMatch = attrs.match(/\brole\s*=\s*["']([^"']+)["']/i);
    if (!roleMatch) return full;

    const roleName = (roleMatch[1] || "").trim().toLowerCase();
    if (roleName !== implicit) return full;

    changes.push(
      `Removed redundant <code>role="${roleName}"</code> from <code>&lt;${tagName.toLowerCase()}&gt;</code> because the element already has that implicit role.`
    );

    const newAttrs = attrs.replace(/\s*\brole\s*=\s*["'][^"']*["']/, "");
    return `<${tagName}${newAttrs}>`;
  });

  // Second pass: add missing aria-checked for switch/checkbox roles
  fixed = fixed.replace(
    /<([a-z0-9:-]+)\b([^>]*\brole\s*=\s*["'](switch|checkbox)["'][^>]*)>/gi,
    (full, tagName, attrs, roleType) => {
      if (/\baria-checked\s*=\s*["'][^"']*["']/i.test(attrs)) {
        return full;
      }
      changes.push(
        `Added default <code>aria-checked="false"</code> to element with <code>role="${roleType}"</code> so its state is exposed to assistive technologies.`
      );
      return `<${tagName}${attrs} aria-checked="false">`;
    }
  );

  // Third pass: add default aria-valuemin/max/now for slider and spinbutton roles
  fixed = fixed.replace(
    /<([a-z0-9:-]+)\b([^>]*\brole\s*=\s*["'](slider|spinbutton)["'][^>]*)>/gi,
    (full, tagName, attrs, roleType) => {
      let newAttrs = attrs;
      let addedSomething = false;

      if (!/\baria-valuemin\s*=\s*["'][^"']*["']/i.test(newAttrs)) {
        newAttrs += ' aria-valuemin="0"';
        addedSomething = true;
      }
      if (!/\baria-valuemax\s*=\s*["'][^"']*["']/i.test(newAttrs)) {
        newAttrs += ' aria-valuemax="100"';
        addedSomething = true;
      }
      if (!/\baria-valuenow\s*=\s*["'][^"']*["']/i.test(newAttrs)) {
        newAttrs += ' aria-valuenow="0"';
        addedSomething = true;
      }

      if (addedSomething) {
        changes.push(
          `Added default <code>aria-valuemin</code>, <code>aria-valuemax</code>, and/or <code>aria-valuenow</code> to element with <code>role="${roleType}"</code> so its value range is communicated.`
        );
      }

      return `<${tagName}${newAttrs}>`;
    }
  );

  // Fourth pass: add role="tablist" to containers that wrap elements with role="tab"
  fixed = fixed.replace(
    /<([a-z0-9:-]+)\b([^>]*)>([\s\S]*?\brole\s*=\s*["']tab["'][\s\S]*?<\/\1>)/gi,
    (full, tagName, attrs, inner) => {
      // If the container already has a role, leave it alone
      if (/\brole\s*=\s*["'][^"']*["']/i.test(attrs)) {
        return full;
      }

      const newAttrs = `${attrs} role="tablist"`;
      changes.push(
        `Added <code>role="tablist"</code> to <code>&lt;${tagName.toLowerCase()}&gt;</code> that wraps elements with <code>role="tab"</code>.`
      );

      return `<${tagName}${newAttrs}>${inner}`;
    }
  );

  lastFixLog = changes;
  return fixed;
}