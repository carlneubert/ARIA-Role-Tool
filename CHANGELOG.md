

# Changelog
All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.3.0] – 2025-02-25
### Added
- Added full Contributor Covenant Code of Conduct (v2.1).
- Added comprehensive CONTRIBUTING.md with architecture, rules, and contributor workflow.
- Added project badges to README (license, PRs welcome, accessibility, stars, issues, built with ❤️, WAI-ARIA focused).
- Added architecture diagram to README.

### Improved
- Updated README architecture and contributor notes for clarity and modularization.
- Cleaned UI accessibility issues around buttons, contrast, and text sizes.

---

## [0.2.0] – 2025-02-23
### Added
- Introduced modular ARIA system with three namespaces:
  - `AriaParse`
  - `AriaChecks`
  - `AriaFixes`
- Added improved autofix logic, including change log generation.
- Added MDN-linked role suggestion chips.
- Added accordion change log section.
- Added GitHub-style copy button overlay for fixed code.
- Added light/dark mode with accessible contrast token system.
- Added custom scrollbars.

### Improved
- Restructured script to move all ARIA logic into dedicated files.
- Improved detection of ARIA misuse (invalid roles, wrong ARIA states, redundant attributes).
- Added accessible-name checks for aria-label misuse / missing labels.
- Improved role suggestion accuracy for custom components.
- Refined spacing, visual hierarchy, headings, and chip styling.
- Increased typography size and added new font pairings.

---

## [0.1.0] – 2025-02-15
### Added
- Initial project setup.
- Snippet input and role detection system.
- Basic ARIA smell detection.
- Early autofix capabilities.
- Light/dark theme toggle.
- First iteration of UI layout.
