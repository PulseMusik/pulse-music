# Commit Guidelines for Single-Person Project

## Where to Commit

- **Small Fixes & Low-Risk Changes:**
  - Commit directly to `main`.
  - Example: Typos, documentation updates, minor UI adjustments.
  - **Reason:** Low risk, doesn’t affect critical parts of the app.
  
- **New Features (Non-Invasive):**
  - Create a **feature branch** (`feature/branch-name`), test it, then merge it into `main`.
  - Example: Adding a new page, UI component, or small feature.
  - **Reason:** Helps to isolate new logic and features before merging into production.

- **Critical Fixes (Low Risk, Time-Sensitive):**
  - Commit directly to `main` and deploy immediately.
  - Example: Fixing a crash, resolving a high-priority issue.
  - **Reason:** Time-sensitive fix needed in production.

- **Server Logic, API Changes, and Major Refactors:**
  - Commit to a **feature branch** (`feature/branch-name`), test it thoroughly, then merge it into `main`.
  - Example: Adding new server-side logic, restructuring core components, database changes.
  - **Reason:** High complexity and potential for breaking things. Requires testing and validation before deploying to production.

- **Infrastructure Changes (Non-Critical):**
  - Commit to **feature/infra** branch, test, then merge to `main`.
  - Example: Server setups, environment changes, or adding new third-party services.
  - **Reason:** Changes to the system's backbone need careful validation.

- **Hotfixes (Urgent):**
  - Commit directly to `main`.
  - Example: Immediate fixes for critical issues in production.
  - **Reason:** Fast, immediate resolution is needed. Test locally before committing.

---

## Commit Messages Format

- **Fixes:**
  ```bash
  git commit -m "fix: [short description of the fix]"