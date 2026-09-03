# Relay — Every risk has an owner

**Live demo:** https://relay-webmcp-openai.netlify.app
**Repo:** https://github.com/maannaan/Relay

Relay is a shift-handoff workspace for multi-location cafés, built on the browser-native **WebMCP** API. It turns scattered closing notes into visible, accountable commitments, and it will not call a handoff safe while any high-impact risk lacks an owner, a deadline, and a fallback plan.

## What Relay actually is, in plain terms

Picture a café closing for the night. Whoever locks up writes a note: *"walk-in fridge stayed at 9°C after the door was fixed, called the repair company, they might come tomorrow."* That note gets logged somewhere — a group chat, a paper log, a shared doc — and then the shift ends. Nothing about that note *forces* anyone to actually check the fridge before the café reopens. The person who wrote it assumes someone will read it. The next morning's opener might not see it until it's too late.

Relay closes that specific gap. It's a small operations dashboard for a café (or a chain of them) where every operational risk — equipment, cash, stock — has to clear one bar before the closing shift is considered "handed off safely": *someone named* owns it, by *a specific time*, with *a fallback plan* if it's still a problem. That check isn't a suggestion in a UI; it's computed from the actual data, so it can't be skipped by accident.

The reason this is a WebMCP project rather than "just a web app" is that Relay also lets an AI agent do real work inside it: read the live shift data, read the actual messy notes a human typed, figure out on its own what's missing, and draft a fix. What the agent categorically cannot do is mark anything as done. There is no tool it can call that approves a draft, confirms a risk, or verifies a handoff — those transitions only happen from a real click by a person, inside the shared app. That boundary is the entire point of the project: an agent that's genuinely useful for finding and proposing fixes, without ever being able to unilaterally decide something is fine.

## For judges — fastest path to evaluating this

1. Open the live demo above.
2. If you have a WebMCP-capable browser (Chrome with `chrome://flags/#enable-webmcp-testing`, or ChatGPT's in-app browser), the sidebar status line will say **"WebMCP tools connected"**.
3. Ask an agent something like: *"Check if any of our café locations have a closing handoff that isn't safe, and if not, fix it."*
4. Watch it read context, find the unowned fridge risk, and draft a plan — then watch it correctly refuse to say the handoff is verified until you click **Approve** yourself in the UI.
5. See [`docs/webmcp-evaluation-checklist.md`](docs/webmcp-evaluation-checklist.md) for a structured 5-minute pass covering all of this, including the note-reasoning tools.

No login, no setup, no seeded API keys — the whole app runs client-side against seeded demo data.

## The Missing Hour

Every closing shift ends with notes nobody reads until it's too late — a fridge that stayed warm, a till that didn't balance, a delivery that got pushed. The gap between "someone wrote this down" and "someone is actually responsible for it before tomorrow's opener walks in" is where things go wrong. Relay calls that gap **the missing hour**, and it's the one thing the product exists to close: a handoff cannot be marked safe while any high-impact risk lacks an owner, a deadline, and a fallback — checked mechanically, not by trusting that someone read the notes.

## Demo flow

Northstar Coffee is closing after a walk-in fridge remains at 9°C. Relay exposes the live shift context and detects that the incident has no owner, deadline, or fallback. An agent can create a reversible handoff draft; the manager must visibly approve it in the app. The UI then records the owner, opening-time deadline, fallback, and audit trail.

Relay also tracks a second, quieter location — **Park Street Coffee** — to show the product scales beyond a single café. An agent can call `list_location_summaries` to decide which location actually needs attention before drilling in.

Relay doesn't pre-label what's risky. A manager can log a brand-new closing note live, in the UI, and the agent has to actually read it (`list_shift_notes`) and decide for itself whether it describes an unaddressed risk before proposing to track it (`flag_risk_from_note`) — this is real reasoning over unstructured text, not a lookup against a status field someone set in advance, and it still can't skip manager confirmation.

## Architecture

Everything is client-side. There is no backend — the "database" is React state (`src/App.tsx`) seeded from `src/data.ts` and persisted to `localStorage` so a page reload never wipes an in-progress demo. The only interface between an AI agent and the app is the browser's own WebMCP implementation:

```
Agent (ChatGPT / any WebMCP client)
        │
        │  document.modelContext.registerTool(...)
        ▼
Relay's registered tools  ──────────►  React state (locations, risks, notes, audit log)
        │                                        │
        │  read-only tools return data           │  state changes re-render the UI
        ▼                                        ▼
Agent sees structured JSON            A human sees the same change, live, in the browser
```

**Data model** (`src/data.ts`):

- `LocationState` — one café: roster, policy, shift notes, tracked risks, audit log.
- `Risk` — has a `status` of `candidate → unowned → drafted → ready` (or `blocked`, for risks that have an owner but an unconfirmed dependency). Only `unowned`/`drafted` **critical**-severity risks block a handoff from verifying.
- `Note` — raw, human-entered text. This is the only thing an agent should treat as untrusted input.
- `Audit` — an append-only log entry with a `tone` of `agent`, `manager`, or `system`, so the UI can visually distinguish who did what.

**Key files:**

```
src/
  App.tsx        — all UI, state, and WebMCP tool registration (single component tree)
  data.ts        — seed data + types for locations, risks, notes, audit entries
  icons.tsx      — inline SVG icon set (including the Relay logo mark)
  styles.css     — the whole visual design system (dark, lime-accent, no external UI kit)
e2e/
  relay.spec.ts  — Playwright tests, including ones that stub document.modelContext
                   and invoke the real registered tool closures directly
public/
  _headers       — COOP/COEP/Permissions-Policy headers WebMCP requires, served by Netlify
docs/
  webmcp-evaluation-checklist.md — manual test pass for judges
  devpost-narrative.md           — submission narrative draft
  video-script.md                 — demo video script and shot list
```

## The 8 WebMCP tools

All tools are registered via the browser-native `document.modelContext.registerTool(...)` API — no custom backend, no REST layer, no polling. Every tool accepts an optional `locationId` (defaults to whichever café is active in the UI).

| Tool | Type | What it does |
|---|---|---|
| `list_location_summaries` | read-only | Every location's readiness at a glance, so the agent can decide where to focus before drilling in. |
| `get_shift_context` | read-only | A location's current shift, roster, policy, and tracked risks. |
| `find_unowned_risks` | read-only, `untrustedContentHint` | Tracked risks that are missing an owner, deadline, or fallback — concise evidence, not raw text. |
| `list_shift_notes` | read-only, `untrustedContentHint` | The raw, unstructured closing notes staff actually wrote, so the agent can read and reason over them directly instead of trusting a pre-set label. |
| `flag_risk_from_note` | **write** | Proposes that a note describes a real, untracked risk. Creates a visible **candidate** — never blocks or verifies a handoff, and can only become a tracked risk through a manager's Confirm click in the UI. |
| `create_handoff_draft` | **write** | Creates a visible, reversible **draft** proposal (owner, deadline, fallback) for a risk. Never assigns work or completes anything. |
| `get_handoff_readiness` | read-only | Reports `blocked`, `manager_approval_required`, or `verified` for a location. There is no corresponding write tool — nothing can set this status directly. |
| `get_handoff_audit_log` | read-only | The full timeline of who did what, with a real human name for every manager action. |

Read-only tools carry `readOnlyHint: true`. Anything that touches human-authored free text — notes, and risks derived from them — carries `untrustedContentHint: true`, per the WebMCP spec's guidance for content an agent should treat as data, not instructions.

## Safety model

Relay's core constraint isn't a UI convention — it's structural. No registered tool can approve a draft, confirm a candidate risk, or mark a handoff verified. Those state transitions only exist behind a human click in the shared UI:

- `create_handoff_draft` creates a **draft** — reversible, visible, not assigned to anyone until approved.
- `flag_risk_from_note` creates a **candidate** risk from the agent's own reading of a note — it doesn't block or verify anything, and can only become a tracked risk through a manager's Confirm click (or get dismissed).
- `get_handoff_readiness` is read-only. It reports `blocked`, `manager_approval_required`, or `verified` — there is no corresponding write tool that can set that status directly.

In real testing with an agentic browser, asking the agent to "just confirm it's approved" without clicking Approve in the UI first produced a correct refusal — the agent read `get_handoff_readiness`, saw no approval event in the audit trail, and said so, honestly, instead of asserting success. That refusal is the safety model working, not a bug — see [`docs/webmcp-evaluation-checklist.md`](docs/webmcp-evaluation-checklist.md) for the full manual test pass.

## Resilience

- If `document.modelContext` isn't present (unsupported browser), Relay shows a banner and the dashboard keeps working manually — nothing appears broken.
- Failed tool registration surfaces its own banner instead of crashing.
- Demo state persists to `localStorage`, so a page reload never loses a draft or approval — only **Reset demo** does. (Note: two genuinely separate browser processes — e.g. your own browser and an agent's sandboxed browsing tool — do not share this storage; for a live agent test, approve inside the same browser/tab the agent is driving.)
- A **Reset demo** control in the sidebar restores both locations to their seeded state for repeatable runs.
- A **Show diagnostics** toggle (or `?demo=1` in the URL) reveals a panel with WebMCP connection status and the last tool calls made — for judges/testers, hidden by default.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints. For Chrome testing, enable `chrome://flags/#enable-webmcp-testing`. WebMCP requires origin isolation; Vite sends the required headers locally, and `public/_headers` carries them for compatible static hosts (Netlify picks this file up automatically from `public/`).

## Build

```bash
npm run build
```

Type-checks with `tsc` and builds a static bundle with Vite. No environment variables or secrets required — everything is seeded client-side.

## Automated tests

```bash
npm run test:e2e
```

Most tests drive the full journey in a standard browser (no WebMCP support there, so they exercise the manual UI path the agent's tool calls also trigger): blocked → draft → manager approval → verified → audit trail → reset, plus the second-location switch and the WebMCP-unavailable resilience banner.

A second test group stubs `document.modelContext` (via Playwright's `addInitScript`) so Relay registers its real tools against a fake agent, then calls those exact registered closures directly — `list_shift_notes`, `flag_risk_from_note`, `get_handoff_readiness` — to prove the actual WebMCP-facing code path works, including that a fabricated note id is rejected and that a flagged candidate never silently blocks or verifies a handoff. This same test stub caught a real bug during development: `registerTool` was being called detached from its `document.modelContext` receiver, which is invisible to a plain-object mock but throws `Illegal invocation` against a real native browser implementation. Fixed with `.bind()`, and the stub now enforces the same receiver check so it can't happen again silently.

## Testing the main journey

1. Select **Walk-in fridge temperature**.
2. Choose **Draft a safe handoff**.
3. Inspect Maya's owner, the 7:30 AM deadline, and the fallback policy.
4. Select **Approve this handoff**.
5. Confirm the status becomes **Handoff verified** and the audit trail gains manager approval and a Relay assignment record.

## Stack

React, TypeScript, Vite, and the browser-native WebMCP Imperative API. No backend, no database, no external API keys. Deployed on Netlify.

## More docs

- [`docs/webmcp-evaluation-checklist.md`](docs/webmcp-evaluation-checklist.md) — a 5-minute manual pass for judges/testers: tool discovery, read-only selection, no approval bypass, verified final state.
- [`docs/devpost-narrative.md`](docs/devpost-narrative.md) — draft submission narrative.
- [`docs/video-script.md`](docs/video-script.md) — 3-minute demo video script and shot list.
