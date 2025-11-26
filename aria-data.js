// -----------------------------------------------------------------------------
// ARIA Role Helper — Reference Data
// -----------------------------------------------------------------------------
// This file only contains static data used by the ARIA logic:
// - ARIA_ROLES: role metadata (name, category, description, MDN URL, hints)
// - ARIA_STATE_HINTS: explanations for common aria-* attributes
// - ROLE_REQUIRED_ARIA: which aria-* are required for certain roles
// - ROLE_DISCOURAGED_ARIA: aria-* combos that are usually a smell
// -----------------------------------------------------------------------------

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
    description:
      "Live region where new information is added and old information may disappear.",
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/complementary_role"
  },
  {
    name: "contentinfo",
    category: "landmark",
    description: "Metadata about the page such as copyright or related links.",
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/contentinfo_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alertdialog_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitemcheckbox_role"
  },
  {
    name: "menuitemradio",
    category: "widget",
    description: "Menu item that is part of a group where only one can be checked.",
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menuitemradio_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/progressbar_role"
  },
  {
    name: "radio",
    category: "widget",
    description:
      "Checkable input in a group of radio roles, where only one can be checked.",
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/scrollbar_role"
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
    description:
      "Divides and distinguishes sections of content. Focusable when used as a widget.",
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/separator_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/spinbutton_role"
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
    description:
      "Grid whose rows can be expanded and collapsed in a hierarchical structure.",
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/columnheader_role"
  },
  {
    name: "definition",
    category: "document structure",
    description: "Definition of a term or concept.",
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/definition_role"
  },
  {
    name: "document",
    category: "document structure",
    description:
      "Section of content to be read in document/browse mode inside an application.",
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
    description:
      "Illustration, diagram, code snippet, etc., that is referenced from the main content.",
    mdnUrl: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/figure_role"
  },
  {
    name: "group",
    category: "document structure",
    description:
      "Set of user interface objects that are not included in a page summary or table of contents.",
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
    description:
      "Element that represents a single graphical image composed of multiple elements.",
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listitem_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/presentation_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/rowheader_role"
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
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/directory_role"
  },

  // Application role
  {
    name: "application",
    category: "other",
    description: "Indicates the element is a web application, not a document.",
    mdnUrl:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/application_role"
  }
];

const ARIA_STATE_HINTS = {
  "aria-expanded":
    "Indicates whether the element controls content that can be expanded or collapsed.",
  "aria-pressed": "Represents the pressed state of a toggle button.",
  "aria-checked": "Represents the checked state of checkboxes, radio buttons, and switches.",
  "aria-selected":
    "Represents the selected state of items in tabs, listboxes, and other composite widgets.",
  "aria-disabled": "Marks the element as disabled and not operable.",
  "aria-hidden": "Indicates whether the element is exposed to assistive technologies.",
  "aria-modal": "Indicates whether a dialog is modal.",
  "aria-controls":
    "Identifies the element(s) whose content or presence is controlled by this element.",
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