// -----------------------------------------------------------------------------
// ARIA Role Tool — Architecture Overview
// -----------------------------------------------------------------------------
// This file contains three main layers:
//
// 1. Reference Data
//    - ARIA_ROLES: full role metadata (name, category, mdn URL, hints)
//    - ARIA_STATE_HINTS, ROLE_REQUIRED_ARIA, ROLE_DISCOURAGED_ARIA
//    These power role lookup, suggestions, and validation.
//
// 2. ARIA Logic (Pure Functions)
//    - detectSmells(): runs all ARIA heuristics; returns issues
//    - generateFixedCode(): applies conservative autofixes + logs changes
//    - helper functions (getImplicitRoleForTag, extractAriaAttributes, etc.)
//    These DO NOT touch the DOM.
//
// 3. UI Layer
//    - updateUI(): orchestrates detection + DOM updates
//    - updateAriaStates() / updateAriaIssues(): panel rendering
//    - theme toggle + copy-to-clipboard logic
//
// The goal: keep ARIA logic pure & reusable, keep DOM work isolated.
// -----------------------------------------------------------------------------
console.log("ARIA Role Helper script loaded");
function updateAriaStates(snippet, smellsForSnippet) {
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

  const effectiveSmells = smellsForSnippet || detectSmells(trimmed) || [];
  const ariaIssuesEl = document.getElementById("smellReport");

  const items = attrs
    .map((a) => {
      const hint = ARIA_STATE_HINTS[a.name] || "ARIA attribute detected.";
      const hasIssue = effectiveSmells.some((msg) => msg.includes(`<code>${a.name}</code>`));
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

function updateAriaIssues(snippet, smellsForSnippet) {
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

  const smells = smellsForSnippet || detectSmells(trimmed);

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

// Main UI controller:
// - Reads the user snippet
// - Runs smell detection once
// - Updates all panels: role summary, highlighted code, fixed code,
//   ARIA states, ARIA issues
// - Handles change log and copy‑to‑clipboard wiring.
function updateUI() {
  const rawSnippet = snippetEl ? snippetEl.value : "";
  const snippet = rawSnippet.trim();

  const smellsForSnippet = detectSmells(snippet) || [];

  // Build a set of ARIA attribute names that have issues so we can highlight them in the code view
  const problematicAriaNames = new Set();
  smellsForSnippet.forEach((msg) => {
    const m = msg.match(/<code>(aria-[a-z0-9_-]+)<\/code>/i);
    if (m && m[1]) {
      problematicAriaNames.add(m[1].toLowerCase());
    }
  });

  if (!roleSummaryEl || !codeSuggestionEl) {
    // Required containers not present; still update ARIA panels so the tool is usable.
    updateAriaStates(rawSnippet, smellsForSnippet);
    updateAriaIssues(rawSnippet, smellsForSnippet);
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
    updateAriaStates(rawSnippet, smellsForSnippet);
    updateAriaIssues(rawSnippet, smellsForSnippet);
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
    (full, name, value) => {
      const lowerName = String(name).toLowerCase();
      const base = `${name}=&quot;${value}&quot;`;
      if (problematicAriaNames.has(lowerName)) {
        return `<span class="highlight-aria highlight-aria-error">${base}</span>`;
      }
      return `<span class="highlight-aria">${base}</span>`;
    }
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

  updateAriaStates(rawSnippet, smellsForSnippet);
  updateAriaIssues(rawSnippet, smellsForSnippet);
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