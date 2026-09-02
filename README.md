# Relay — Every risk has an owner

Relay is a WebMCP-powered shift-handoff workspace. It turns scattered closing notes into visible, accountable commitments and does not consider a handoff safe while a high-impact risk lacks an owner, deadline, or fallback.

## Demo flow

Northstar Coffee is closing after a walk-in fridge remains at 9°C. Relay exposes the live shift context and detects that the incident has no owner, deadline, or fallback. An agent can create a reversible handoff draft; the manager must visibly approve it in the app. The UI then records the owner, opening-time deadline, fallback, and audit trail.

Relay also tracks a second, quieter location — **Park Street Coffee** — to show the product scales beyond a single café. An agent can call `list_location_summaries` to decide which location actually needs attention before drilling in.

Relay doesn't pre-label what's risky. A manager can log a brand-new closing note live, in the UI, and the agent has to actually read it (`list_shift_notes`) and decide for itself whether it describes an unaddressed risk before proposing to track it (`flag_risk_from_note`) — this is real reasoning over unstructured text, not a lookup against a status field someone set in advance, and it still can't skip manager confirmation.

## Why WebMCP

The agent works with structured, live application state instead of interpreting DOM controls:

- `list_location_summaries` — every location's readiness at a glance, so the agent can pick where to focus.
- `get_shift_context` — a location's current shift, roster, policy, and risks.
- `find_unowned_risks` — concise evidence for tracked risks that have missing accountability.
- `list_shift_notes` — the raw, unstructured closing notes staff wrote, for the agent to read and reason over directly.
- `flag_risk_from_note` — proposes that a note describes a real risk; creates a visible candidate that never blocks or verifies a handoff until a manager confirms it.
- `create_handoff_draft` — makes a visible, reversible proposal for manager review.
- `get_handoff_readiness` — reports whether a location's handoff is blocked, awaiting a manager, or verified.
- `get_handoff_audit_log` — explains every decision and its actor.

Every tool accepts an optional `locationId` (defaults to the active location in the UI). Read-only tools use `readOnlyHint`. Shift-note content and anything derived from it is labeled with `untrustedContentHint`. Relay intentionally does not expose a tool that can silently approve, assign, or confirm work: manager action is always a visible, human step in the shared app.

## Resilience

- If `document.modelContext` isn't present (unsupported browser), Relay shows a banner and the dashboard keeps working manually — nothing appears broken.
- Failed tool registration surfaces its own banner instead of crashing.
- A **Reset demo** control in the sidebar restores both locations to their seeded state for repeatable runs.
- A **Show diagnostics** toggle (or `?demo=1` in the URL) reveals a panel with WebMCP connection status and the last tool calls made — for judges/testers, hidden by default.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints. For Chrome testing, enable `chrome://flags/#enable-webmcp-testing`. WebMCP requires origin isolation; Vite sends the required headers locally, and `public/_headers` carries them for compatible static hosts.

## Build

```bash
npm run build
```

## Automated tests

```bash
npm run test:e2e
```

Most tests drive the full journey in a standard browser (no WebMCP support there, so they exercise the manual UI path the agent's tool calls also trigger): blocked → draft → manager approval → verified → audit trail → reset, plus the second-location switch and the WebMCP-unavailable resilience banner.

A second test group stubs `document.modelContext` (via Playwright's `addInitScript`) so Relay registers its real tools against a fake agent, then calls those exact registered closures directly — `list_shift_notes`, `flag_risk_from_note`, `get_handoff_readiness` — to prove the actual WebMCP-facing code path works, including that a fabricated note id is rejected and that a flagged candidate never silently blocks or verifies a handoff.

## Testing the main journey

1. Select **Walk-in fridge temperature**.
2. Choose **Draft a safe handoff**.
3. Inspect Maya's owner, the 7:30 AM deadline, and the fallback policy.
4. Select **Approve this handoff**.
5. Confirm the status becomes **Handoff verified** and the audit trail gains manager approval and a Relay assignment record.

## Stack

React, TypeScript, Vite, and the browser-native WebMCP Imperative API.
