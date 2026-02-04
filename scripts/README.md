# Scripts

## Week 1 Code Splitting Verification

**Scripts:** `check-week1-complete.sh` (Bash) and `check-week1-complete.ps1` (PowerShell)

Runs build, Sentry test page, bundle checks, dev server + Lighthouse, and prints a final report.

### How to run

- **PowerShell (Windows, recommended):**  
  `.\scripts\check-week1-complete.ps1`

- **Git Bash (Windows):**  
  `./scripts/check-week1-complete.sh`  
  or  
  `bash scripts/check-week1-complete.sh`

- **Linux / macOS:**  
  `./scripts/check-week1-complete.sh`  
  or  
  `bash scripts/check-week1-complete.sh`

### Output

- Report: `reports/week1-report.txt`
- Build log: `reports/build.log`
- Lighthouse JSON: `reports/lighthouse-after.json` (if Lighthouse runs)

### Optional

- **Skip Lighthouse** (faster run):  
  `$env:SKIP_LIGHTHOUSE = "1"; .\scripts\check-week1-complete.ps1`  
  or  
  `SKIP_LIGHTHOUSE=1 ./scripts/check-week1-complete.sh`

### Manual steps (after script)

1. **Sentry Immediate:** Open Sentry dashboard within 60s after the script opens `public/test-error.html` and confirm event "Week1 Test Immediate Error".
2. **Sentry Defer:** With dev server running, open `/` → Network tab: `sentry.browser.js` loads immediately; `sentry.replay.js` / tracing chunk after ~3s.
3. **Rollback:** In console run `localStorage.setItem('DISABLE_LAZY','true'); location.reload()` and confirm replay/tracing load immediately (no 3s delay).
