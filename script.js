console.log("ARIA Role Helper script loaded");

// All non-abstract WAI-ARIA roles (MDN-ish list)
const ARIA_ROLES = [
  // Live region roles
  {
    name: "alert",
    category: "live region",
    description: "Important, usually time-sensitive information.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role"
  },
  {
    name: "log",
    category: "live region",
    description: "Live region where new information is added and old information may disappear.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/log_role"
  },
  {
    name: "marquee",
    category: "live region",
    description: "Non-essential information that changes frequently.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/marquee_role"
  },
  {
    name: "status",
    category: "live region",
    description: "Advisory information; usually not as urgent as an alert.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role"
  },
  {
    name: "timer",
    category: "live region",
    description: "Numeric counter which indicates elapsed or remaining time.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/timer_role"
  },

  // Landmark roles
  {
    name: "banner",
    category: "landmark",
    description: "Site-oriented content, typically including a logo or site-level heading.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/banner_role"
  },
  {
    name: "complementary",
    category: "landmark",
    description: "Supporting section of the page, complementary but not central.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/complementary_role"
  },
  {
    name: "contentinfo",
    category: "landmark",
    description: "Metadata about the page such as copyright or related links.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/contentinfo_role"
  },
  {
    name: "form",
    category: "landmark",
    description: "Region of the page that represents a form, when it has an accessible name.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/form_role"
  },
  {
    name: "main",
    category: "landmark",
    description: "Main content of a document; unique and central to the page.",
    htmlPreferred: "<main>",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/main_role"
  },
  {
    name: "navigation",
    category: "landmark",
    description: "Collection of navigational links.",
    htmlPreferred: "<nav>",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role"
  },
  {
    name: "region",
    category: "landmark",
    description: "Noteworthy section of the page with an accessible name.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/region_role"
  },
  {
    name: "search",
    category: "landmark",
    description: "Region of the page devoted to search functionality.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role"
  },

  // Window roles
  {
    name: "alertdialog",
    category: "window",
    description: "Dialog containing an alert or time-sensitive information.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alertdialog_role"
  },
  {
    name: "dialog",
    category: "window",
    description: "Modal or non-modal dialog window.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role"
  },

  // Widget roles
  {
    name: "button",
    category: "widget",
    description: "Clickable element that performs an action.",
    htmlPreferred: "<button>",
    goodFor: ["custom button", "icon button", "JS-only click handler"],
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role"
  },
  {
    name: "checkbox",
    category: "widget",
    description: "Checkable input that has two or three states.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role"
  },
  {
    name: "combobox",
    category: "widget",
    description: "Composite widget combining a text field with a list of possible values.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role"
  },
  {
    name: "grid",
    category: "widget",
    description: "Widget with rows and cells, similar to a spreadsheet.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/grid_role"
  },
  {
    name: "gridcell",
    category: "widget",
    description: "Cell in a grid or treegrid, similar to HTML <td>.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/gridcell_role"
  },
  {
    name: "link",
    category: "widget",
    description: "Interactive reference to a resource.",
    htmlPreferred: "<a href>",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/link_role"
  },
  {
    name: "listbox",
    category: "widget",
    description: "List of options from which a user can select one or more.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role"
  },
  {
    name: "menu",
    category: "widget",
    description: "A type of list that offers a set of choices.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role"
  },
  {
    name: "menubar",
    category: "widget",
    description: "Presentation of a menu that is usually persistent and horizontal.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menubar_role"
  },
  {
    name: "menuitem",
    category: "widget",
    description: "Option in a set of choices contained in a menu or menubar.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitem_role"
  },
  {
    name: "menuitemcheckbox",
    category: "widget",
    description: "Checkable menu item with true/false/mixed states.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitemcheckbox_role"
  },
  {
    name: "menuitemradio",
    category: "widget",
    description: "Menu item that is part of a group where only one can be checked.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitemradio_role"
  },
  {
    name: "meter",
    category: "widget",
    description: "Represents a scalar measurement within a known range.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/meter_role"
  },
  {
    name: "option",
    category: "widget",
    description: "Selectable item in a listbox, combo box, or tree.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/option_role"
  },
  {
    name: "progressbar",
    category: "widget",
    description: "Displays the progress status for a task.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role"
  },
  {
    name: "radio",
    category: "widget",
    description: "Checkable input in a group of radio roles, where only one can be checked.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radio_role"
  },
  {
    name: "radiogroup",
    category: "widget",
    description: "Group of related radio buttons.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radiogroup_role"
  },
  {
    name: "scrollbar",
    category: "widget",
    description: "Controls the scrolling of content within a region.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/scrollbar_role"
  },
  {
    name: "searchbox",
    category: "widget",
    description: "Text box that is intended for search.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/searchbox_role"
  },
  {
    name: "separator",
    category: "widget",
    description: "Divides and distinguishes sections of content. Focusable when used as a widget.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/separator_role"
  },
  {
    name: "slider",
    category: "widget",
    description: "Allows the user to select a value from a given range.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role"
  },
  {
    name: "spinbutton",
    category: "widget",
    description: "Allows the user to step through a range of values.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/spinbutton_role"
  },
  {
    name: "switch",
    category: "widget",
    description: "Represents a checkbox that represents on/off values.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/switch_role"
  },
  {
    name: "tab",
    category: "widget",
    description: "A header in a tabbed interface.",
    goodFor: ["tabbed navigation"],
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role"
  },
  {
    name: "tablist",
    category: "widget",
    description: "Container for a set of tabs.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role"
  },
  {
    name: "tabpanel",
    category: "widget",
    description: "The panel associated with a tab.",
    goodFor: ["tab content"],
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tabpanel_role"
  },
  {
    name: "textbox",
    category: "widget",
    description: "Input that allows free-form text.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/textbox_role"
  },
  {
    name: "tree",
    category: "widget",
    description: "Widget that presents a hierarchical list of items.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tree_role"
  },
  {
    name: "treegrid",
    category: "widget",
    description: "Grid whose rows can be expanded and collapsed in a hierarchical structure.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treegrid_role"
  },
  {
    name: "treeitem",
    category: "widget",
    description: "Item in a tree structure.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treeitem_role"
  },
  {
    name: "toolbar",
    category: "widget",
    description: "Group of controls, such as buttons or checkboxes.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/toolbar_role"
  },
  {
    name: "tooltip",
    category: "widget",
    description: "Popup that provides a description for another element.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role"
  },

  // Document structure roles
  {
    name: "article",
    category: "document structure",
    description: "Self-contained composition in a document or site.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/article_role"
  },
  {
    name: "cell",
    category: "document structure",
    description: "Generic cell in a tabular container.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/cell_role"
  },
  {
    name: "columnheader",
    category: "document structure",
    description: "Header for a column of cells.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/columnheader_role"
  },
  {
    name: "definition",
    category: "document structure",
    description: "Definition of a term or concept.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/definition_role"
  },
  {
    name: "document",
    category: "document structure",
    description: "Section of content to be read in document/browse mode inside an application.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/document_role"
  },
  {
    name: "feed",
    category: "document structure",
    description: "Dynamic list of articles or concepts that may be loaded progressively.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role"
  },
  {
    name: "figure",
    category: "document structure",
    description: "Illustration, diagram, code snippet, etc., that is referenced from the main content.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/figure_role"
  },
  {
    name: "group",
    category: "document structure",
    description: "Set of user interface objects that are not included in a page summary or table of contents.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/group_role"
  },
  {
    name: "heading",
    category: "document structure",
    description: "Heading for a section of the page.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/heading_role"
  },
  {
    name: "img",
    category: "document structure",
    description: "Element that represents a single graphical image composed of multiple elements.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role"
  },
  {
    name: "list",
    category: "document structure",
    description: "Container for a list of items.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/list_role"
  },
  {
    name: "listitem",
    category: "document structure",
    description: "Item within a list.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listitem_role"
  },
  {
    name: "math",
    category: "document structure",
    description: "Mathematical expression.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/math_role"
  },
  {
    name: "note",
    category: "document structure",
    description: "Content that is parenthetical or ancillary to the main content.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/note_role"
  },
  {
    name: "presentation",
    category: "document structure",
    description: "Removes element’s implicit semantics, synonym of none.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/presentation_role"
  },
  {
    name: "none",
    category: "document structure",
    description: "Synonym of presentation; removes semantics.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/none_role"
  },
  {
    name: "row",
    category: "document structure",
    description: "Row of cells in a table, grid, or treegrid.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/row_role"
  },
  {
    name: "rowgroup",
    category: "document structure",
    description: "Group of rows within a tabular container.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/rowgroup_role"
  },
  {
    name: "rowheader",
    category: "document structure",
    description: "Header for a row of cells.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/rowheader_role"
  },
  {
    name: "table",
    category: "document structure",
    description: "A table of data arranged in rows and columns.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/table_role"
  },
  {
    name: "term",
    category: "document structure",
    description: "Term or concept that is defined by the associated definition.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/term_role"
  },
  {
    name: "generic",
    category: "document structure",
    description: "Nameless container element with no semantic meaning.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/generic_role"
  },
  // Deprecated but sometimes seen
  {
    name: "directory",
    category: "document structure",
    description: "Deprecated: static table of contents. Use list instead.",
    deprecated: true,
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/directory_role"
  },

  // Application role
  {
    name: "application",
    category: "other",
    description: "Indicates the element is a web application, not a document.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/application_role"
  }
];

// --- ARIA State/Property Hints and Validation ---
const ARIA_STATE_HINTS = {
  "aria-expanded": "Indicates whether the element controls content that can be expanded or collapsed.",
  "aria-pressed": "Represents the pressed state of a toggle button.",
  "aria-checked": "Represents the checked state of checkboxes, radio buttons, and switches.",
  "aria-selected": "Represents the selected state of items in tabs, listboxes, and other composite widgets.",
  "aria-disabled": "Marks the element as disabled and not operable.",
  "aria-hidden": "Indicates whether the element is exposed to assistive technologies.",
  "aria-modal": "Indicates whether a dialog is modal.",
  "aria-controls": "Identifies the element(s) whose content or presence is controlled by this element.",
  "aria-labelledby": "Identifies the element(s) that label this element.",
  "aria-describedby": "Identifies the element(s) that describe this element."
};

const ROLE_REQUIRED_ARIA = {
  checkbox: ["aria-checked"],
  switch: ["aria-checked"],
  menuitemcheckbox: ["aria-checked"],
  menuitemradio: ["aria-checked"],
  tab: ["aria-selected"],
  option: ["aria-selected"],
  slider: ["aria-valuemin", "aria-valuemax", "aria-valuenow"],
  spinbutton: ["aria-valuemin", "aria-valuemax", "aria-valuenow"],
  scrollbar: ["aria-valuemin", "aria-valuemax", "aria-valuenow"],
  progressbar: ["aria-valuemin", "aria-valuemax", "aria-valuenow"],
  combobox: ["aria-expanded", "aria-controls"]
};

const ROLE_DISCOURAGED_ARIA = {
  button: ["aria-selected"],
  tabpanel: ["aria-selected"],
  listitem: ["aria-expanded"],
  checkbox: ["aria-selected"],
  radio: ["aria-selected"],
  link: ["aria-pressed"],
  tab: ["aria-pressed"]
};

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

function detectSmells(snippet) {
  const smells = [];
  if (!snippet) return smells;

  const lower = snippet.toLowerCase();

  // role="presentation"/"none" on focusable elements
  const presentationalRegex = /<([a-z0-9:-]+)\b[^>]*\brole\s*=\s*["'](presentation|none)["'][^>]*>/gi;
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

  // Mouse-only handlers on non-interactive elements
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

  // aria-expanded without aria-controls
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

  // role="tab" with aria-expanded instead of aria-selected
  const tabExpandedRegex =
    /<([a-z0-9:-]+)\b[^>]*\brole\s*=\s*["']tab["'][^>]*\baria-expanded\s*=\s*["'](true|false)["'][^>]*>/gi;
  if (tabExpandedRegex.test(snippet)) {
    smells.push(
      'Found <code>aria-expanded</code> on an element with <code>role="tab"</code>. Tabs usually use <code>aria-selected</code> to indicate the active tab.'
    );
  }

  // role="dialog" without aria-modal
  if (
    /\brole\s*=\s*["']dialog["']/.test(lower) &&
    !/\baria-modal\s*=\s*["'](true|false)["']/.test(lower)
  ) {
    smells.push(
      'Dialog found without <code>aria-modal</code>. If this is a modal dialog, consider <code>aria-modal="true"</code> and managing focus.'
    );
  }

  // role="switch" without aria-checked
  if (
    /\brole\s*=\s*["']switch["']/.test(lower) &&
    !/\baria-checked\s*=\s*["'](true|false)["']/.test(lower)
  ) {
    smells.push(
      'Element with <code>role="switch"</code> is missing <code>aria-checked</code>. Switches should expose their on/off state.'
    );
  }

  validateAriaAgainstRoles(snippet, smells);
  detectRoleStructureIssues(snippet, smells);
  return smells;
}

// Store the most recent fix log globally
let lastFixLog = [];

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

function updateAriaStates(snippet) {
  const ariaStatesReportEl = document.getElementById("ariaStatesReport");
  const raw = snippet || "";
  const trimmed = raw.trim();

  if (!ariaStatesReportEl) return;

  if (!trimmed) {
    ariaStatesReportEl.innerHTML = `
      <div class="empty-state">
        When your snippet includes <code>aria-*</code> attributes, we'll list them here and call out common issues.
      </div>`;
    return;
  }

  const attrs = extractAriaAttributes(trimmed);

  if (!attrs.length) {
    ariaStatesReportEl.innerHTML = `
      <div class="empty-state">
        No <code>aria-*</code> attributes detected. If you're already using semantic HTML and simple controls, you may not need ARIA states or properties here.
      </div>`;
    return;
  }

  const smellsForSnippet = detectSmells(trimmed) || [];
  const ariaIssuesEl = document.getElementById("smellReport");

  const items = attrs
    .map((a) => {
      const hint = ARIA_STATE_HINTS[a.name] || "ARIA attribute detected.";
      const hasIssue = smellsForSnippet.some((msg) => msg.includes(`<code>${a.name}</code>`));
      const issueTag =
        hasIssue && ariaIssuesEl
          ? '<span class="aria-issue-tag">Potential issue – see ARIA issues.</span>'
          : "";
      return `<li><code>${a.name}="${a.value}"</code> – ${hint}${issueTag}</li>`;
    })
    .join("");

  ariaStatesReportEl.innerHTML = `
    <div class="warning" aria-hidden="true">Detected ARIA states &amp; properties:</div>
    <ul class="aria-list">
      ${items}
    </ul>`;
}

function updateAriaIssues(snippet) {
  const ariaIssuesEl = document.getElementById("smellReport");
  if (!ariaIssuesEl) return;

  const raw = snippet || "";
  const trimmed = raw.trim();

  if (!trimmed) {
    ariaIssuesEl.innerHTML = `
      <div class="empty-state">
        Paste code to see quick ARIA checks.
      </div>`;
    return;
  }

  const smells = detectSmells(trimmed);

  if (!smells.length) {
    ariaIssuesEl.innerHTML = `
      <div class="empty-state">
        No obvious ARIA issues detected. This doesn't guarantee full accessibility, but it's a good sign.
      </div>`;
    return;
  }

  const items = smells.map((msg) => `<li>${msg}</li>`).join("");

  ariaIssuesEl.innerHTML = `
    <ul class="smell-list">
      ${items}
    </ul>`;
}

// --- UI wiring ---

const snippetEl = document.getElementById("snippet");
const roleSummaryEl = document.getElementById("roleSummary");
const codeSuggestionEl = document.getElementById("codeSuggestion");
const roleChipsEl = document.getElementById("roleChips");
const fixedCodeEl = document.getElementById("fixedCode");
const themeToggleBtn = document.getElementById("themeToggle");

function findRole(roleName) {
  const key = (roleName || "").trim().toLowerCase();
  return ARIA_ROLES.find((r) => r.name === key) || null;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function updateUI() {
  const rawSnippet = snippetEl ? snippetEl.value : "";
  const snippet = rawSnippet.trim();

  if (!roleSummaryEl || !codeSuggestionEl) {
    // Required containers not present; still update ARIA panels so the tool is usable.
    updateAriaStates(rawSnippet);
    updateAriaIssues(rawSnippet);
    return;
  }

  // No snippet: show instructional empty states
  if (!snippet) {
    roleSummaryEl.innerHTML = `
      <div class="empty-state">
        Paste a snippet that includes <code>role="…"</code> to see details about that role.
      </div>`;
    codeSuggestionEl.innerHTML = `
      <div class="empty-state">
        We'll highlight any <code>role="…"</code> attributes we find in your snippet.
      </div>`;
    if (roleChipsEl) {
      roleChipsEl.innerHTML = "";
    }
    if (fixedCodeEl) {
      fixedCodeEl.classList.add("empty-state");
      fixedCodeEl.innerHTML = `When we detect issues or missing roles/ARIA attributes, we’ll generate a corrected version of your snippet here.`;
    }
    updateAriaStates(rawSnippet);
    updateAriaIssues(rawSnippet);
    return;
  }

  // Find all role="…" occurrences in the snippet, normalized to lowercase
  const roleRegex = /\brole\s*=\s*["']([^"']+)["']/gi;
  const rolesFound = [];
  let match;
  while ((match = roleRegex.exec(snippet)) !== null) {
    const rawName = (match[1] || "").trim().toLowerCase();
    if (rawName) {
      rolesFound.push(rawName);
    }
  }

  const uniqueRoles = [...new Set(rolesFound)];
  let primaryRole = null;

  // Choose the first role that we know about
  for (const roleName of uniqueRoles) {
    const found = findRole(roleName);
    if (found) {
      primaryRole = found;
      break;
    }
  }

  // ---- NEW BLOCK: IMPLICIT + EXPLICIT ROLE LOGIC ----

  // Infer implicit roles when no explicit role="…" is present
  let implicitRoles = [];
  if (!uniqueRoles.length) {
    const tagRegex = /<([a-z0-9:-]+)\b[^>]*>/gi;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(snippet)) !== null) {
      const tagText = tagMatch[0];
      const tagName = tagMatch[1];
      const implicit = getImplicitRoleForTag(tagText, tagName);
      if (implicit) implicitRoles.push(implicit);
    }
    implicitRoles = [...new Set(implicitRoles)];
  }

  // Original role chips row no longer needed now that the primary role pill shows the main role.
  if (roleChipsEl) {
    roleChipsEl.innerHTML = "";
  }

  // Suggested role summary block
  if (!uniqueRoles.length) {
    // No explicit roles — try implicit roles
    if (implicitRoles.length) {
      const implicitName = implicitRoles[0];
      const implicitRole = findRole(implicitName);

      if (implicitRole) {
        const htmlPreferred = implicitRole.htmlPreferred
          ? `<span class="chip">Prefer ${escapeHtml(implicitRole.htmlPreferred)}</span>`
          : "";
        const goodFor = implicitRole.goodFor
          ? implicitRole.goodFor.map((g) => `<span class="chip">${escapeHtml(g)}</span>`).join("")
          : "";
        const deprecated = implicitRole.deprecated
          ? `<span class="chip" style="border-color:#f97373;color:#f97373;">Deprecated</span>`
          : "";

        roleSummaryEl.innerHTML = `
          ${
            implicitRole.mdnUrl
              ? `<a class="role-pill role-pill-link" href="${implicitRole.mdnUrl}" target="_blank" rel="noreferrer">
                   <span class="label">implicit role</span>
                   <code>${implicitRole.name}</code>
                 </a>`
              : `<div class="role-pill">
                   <span class="label">implicit role</span>
                   <code>${implicitRole.name}</code>
                 </div>`
          }
          <p class="description">${implicitRole.description}</p>
          <div class="role-meta">
            <span class="chip">${implicitRole.category}</span>
            ${htmlPreferred}
            ${goodFor}
            ${deprecated}
          </div>
          <p class="description" style="margin-top:0.6rem;">
            This role comes from the native HTML element. You usually don't need to explicitly set <code>role="${implicitRole.name}"</code>.
          </p>
        `;
      } else {
        roleSummaryEl.innerHTML = `
          <div class="empty-state">
            We detected an implicit role, but it is not in the built-in ARIA reference.
          </div>`;
      }
    } else {
      // No explicit roles AND no implicit roles
      roleSummaryEl.innerHTML = `
        <div class="empty-state">
          No <code>role="…"</code> attributes or implicit roles detected.
          Try using semantic HTML elements like <code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>, or <code>&lt;main&gt;</code>.
        </div>`;
    }
  } else if (primaryRole) {
    // Explicit role rendering
    const htmlPreferred = primaryRole.htmlPreferred
      ? `<span class="chip">Prefer ${escapeHtml(primaryRole.htmlPreferred)}</span>`
      : "";
    const goodFor = primaryRole.goodFor
      ? primaryRole.goodFor.map((g) => `<span class="chip">${escapeHtml(g)}</span>`).join("")
      : "";
    const deprecated = primaryRole.deprecated
      ? `<span class="chip" style="border-color:#f97373;color:#f97373;">Deprecated</span>`
      : "";

    roleSummaryEl.innerHTML = `
      ${
        primaryRole.mdnUrl
          ? `<a class="role-pill role-pill-link" href="${primaryRole.mdnUrl}" target="_blank" rel="noreferrer">
               <span class="label">role</span>
               <code>${primaryRole.name}</code>
             </a>`
          : `<div class="role-pill">
               <span class="label">role</span>
               <code>${primaryRole.name}</code>
             </div>`
      }
      <p class="description">${primaryRole.description}</p>
      <div class="role-meta">
        <span class="chip">${primaryRole.category}</span>
        ${htmlPreferred}
        ${goodFor}
        ${deprecated}
      </div>
      <p class="description" style="margin-top:0.6rem;">
        Prefer native HTML where possible. Only use this ARIA role when you can't use the semantic element.
      </p>
    `;
  } else {
    // Roles found but not in dataset
    roleSummaryEl.innerHTML = `
      <div class="warning">
        Detected role(s): ${uniqueRoles.map((r) => `<code>${escapeHtml(r)}</code>`).join(", ")}.
        They are not in the built-in ARIA reference.
      </div>`;
  }

  // Highlight role and ARIA usage inside the code suggestion block
  let highlighted = escapeHtml(snippet);

  // Highlight roles like role="button"
  highlighted = highlighted.replace(
    /\brole=&quot;([^&]*)&quot;/g,
    `<span class="highlight-role">role=&quot;$1&quot;</span>`
  );

  // Highlight ARIA states and properties like aria-expanded="true"
  highlighted = highlighted.replace(
    /\b(aria-[a-z0-9_-]+)=&quot;([^&]*)&quot;/gi,
    `<span class="highlight-aria">$1=&quot;$2&quot;</span>`
  );

  codeSuggestionEl.innerHTML = `
    <label>Detected role and ARIA usage</label>
    <pre>${highlighted}</pre>`;

  // Populate Fixed code section with a first-pass fixed version of the snippet
  if (fixedCodeEl) {
    const fixed = generateFixedCode(rawSnippet);
    const hasFixes = Array.isArray(lastFixLog) && lastFixLog.length > 0;

    if (!hasFixes) {
      fixedCodeEl.classList.add("empty-state");
      fixedCodeEl.innerHTML = `
        <div class="empty-state">
          No automatic fixes were applied. Your ARIA usage may already be in good shape, or only advisory issues were found.
        </div>`;
    } else {
      const output = escapeHtml(fixed);

      const changeLogHtml = `
        <section class="change-log" aria-labelledby="changeLogToggle">
          <button
            type="button"
            class="change-log-toggle"
            id="changeLogToggle"
            aria-expanded="false"
            aria-controls="changeLogPanel"
          >
            View suggested changes
          </button>
          <div
            id="changeLogPanel"
            class="change-log-panel"
            hidden
          >
            <p class="description" style="margin-top:0.75rem;">Changes suggested for this snippet:</p>
            <ul class="aria-list">
              ${lastFixLog.map((msg) => `<li>${msg}</li>`).join("")}
            </ul>
          </div>
        </section>`;

      fixedCodeEl.classList.remove("empty-state");
      fixedCodeEl.innerHTML = `
        <label for="fixedCodePre">Fixed code (preview)</label>
        <div class="fixed-code-wrapper">
          <button
            type="button"
            class="copy-fixed-btn"
            aria-label="Copy fixed code to clipboard"
          >
            Copy
          </button>
          <pre id="fixedCodePre">${output}</pre>
        </div>
        ${changeLogHtml}
      `;

      const changeLogToggle = fixedCodeEl.querySelector(".change-log-toggle");
      const changeLogPanel = fixedCodeEl.querySelector(".change-log-panel");

      if (changeLogToggle && changeLogPanel) {
        changeLogToggle.addEventListener("click", () => {
          const isExpanded = changeLogToggle.getAttribute("aria-expanded") === "true";
          changeLogToggle.setAttribute("aria-expanded", String(!isExpanded));
          changeLogPanel.hidden = isExpanded;
        });
      }

      const copyFixedBtn = fixedCodeEl.querySelector(".copy-fixed-btn");
      const fixedPre = fixedCodeEl.querySelector("#fixedCodePre");

      if (copyFixedBtn && fixedPre) {
        copyFixedBtn.addEventListener("click", async () => {
          const code = fixedPre.textContent || "";
          const originalText = copyFixedBtn.textContent;

          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(code);
            } else {
              const ta = document.createElement("textarea");
              ta.value = code;
              ta.setAttribute("readonly", "");
              ta.style.position = "absolute";
              ta.style.left = "-9999px";
              document.body.appendChild(ta);
              ta.select();
              document.execCommand("copy");
              document.body.removeChild(ta);
            }

            copyFixedBtn.textContent = "Copied";
            copyFixedBtn.setAttribute("aria-label", "Fixed code copied to clipboard");
            setTimeout(() => {
              copyFixedBtn.textContent = originalText;
              copyFixedBtn.setAttribute("aria-label", "Copy fixed code to clipboard");
            }, 2000);
          } catch (e) {
            copyFixedBtn.textContent = "Error";
            copyFixedBtn.setAttribute("aria-label", "Copy failed");
            setTimeout(() => {
              copyFixedBtn.textContent = originalText;
              copyFixedBtn.setAttribute("aria-label", "Copy fixed code to clipboard");
            }, 2000);
          }
        });
      }
    }
  }

  updateAriaStates(rawSnippet);
  updateAriaIssues(rawSnippet);
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-pressed", "true");
      themeToggleBtn.setAttribute("aria-label", "Switch to dark mode");
    }
  } else {
    // default to dark
    root.removeAttribute("data-theme");
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-pressed", "false");
      themeToggleBtn.setAttribute("aria-label", "Switch to light mode");
    }
  }
}

function getCurrentTheme() {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

function initThemeToggle() {
  // Start in light mode by default
  applyTheme("light");

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = getCurrentTheme();
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
    });
  }
}

if (snippetEl) {
  snippetEl.addEventListener("input", updateUI);
}

// Init
updateUI();
initThemeToggle();