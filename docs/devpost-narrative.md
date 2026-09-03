# Devpost narrative — Relay

*Draft for the Devpost "Inspiration / What it does / How we built it / Challenges / Accomplishments / What's next" sections. Trim to fit their actual field limits.*

## Inspiration

Every café that closes and reopens the next morning runs on trust: trust that whoever wrote the closing note also made sure someone would act on it. That trust breaks in a specific, predictable place — call it **the missing hour**. A fridge stays warm, a till doesn't balance, a delivery gets pushed — someone notes it, and then the shift ends. Nobody has explicitly said "I own this by 7:30 AM," so nobody does, until the opening crew discovers it live. Existing tools (shared docs, Slack, a paper log) store the note. None of them check whether it was ever actually assigned. We wanted to see if a browser-native agent, given the right tools, could close that gap — without ever being allowed to fake having closed it.

## What it does

Relay is a shift-handoff workspace for multi-location cafés. It tracks two things per location: the operational risks that could hurt tomorrow's opening (equipment, cash, stock), and whether each one has an owner, a deadline, and a fallback plan. A handoff is only "verified" when every high-impact risk clears that bar — checked mechanically, never by assuming someone read the notes.

An agent (via WebMCP) can read the live shift context, find risks with no owner, read raw unstructured closing notes and decide for itself whether something in them needs tracking, and propose a recovery plan. What it cannot do, by design, is approve anything. Every draft the agent creates and every risk it flags from a note sits visibly in the shared UI until a human clicks Confirm or Approve. We tested this directly: asking the agent to "just confirm it's approved" without a real approval produces a correct refusal, because there's no tool that could do it even if the agent tried.

## How we built it

React + TypeScript + Vite, with the browser-native WebMCP Imperative API (`document.modelContext.registerTool`) as the only interface between the agent and the app — no custom backend, no separate API layer. Eight tools cover the full loop: discovering which of two seeded café locations needs attention, reading context and raw notes, proposing a draft or a candidate risk, and reporting readiness and an audit trail. Read-only tools are marked `readOnlyHint`; anything derived from human-written note text is marked `untrustedContentHint`. State persists to `localStorage` so a reload never wipes a demo mid-run, and origin-isolation headers (COOP/COEP/Permissions-Policy) are served both in local dev and from the Netlify deploy.

## Challenges we ran into

The hardest bug wasn't in the WebMCP layer — it was a React state-timing bug where a value computed inside a `setState` updater was read immediately after, before React had actually run the updater, silently returning stale data to both the UI and the agent-facing tool response. It only showed up under real testing, not code review, which reinforced that live-agent testing has to happen early, not as a final checkbox. We also initially built the risk-detection logic as a static lookup against pre-labeled seed data — which looked convincing in a scripted demo but wasn't real reasoning. We tore that out and replaced it with tools that hand the agent raw, unstructured note text and make it decide for itself, gated the same way everything else is: propose, don't approve.

## Accomplishments we're proud of

Getting a real agentic browsing tool to run the full loop unassisted — discover tools, read context across two locations, draft a recovery plan, then correctly and repeatedly refuse to claim the handoff was verified until an actual human click existed in the audit trail. That refusal, captured live, is the whole thesis of the product working in front of us, not asserted in a README.

## What's next

Swap seeded state for a real backend (Supabase) with role-based access across owner/area-manager/shift-manager/staff, real POS and scheduling integrations, and post-approval notifications (opening-owner reminders, missed-deadline escalation, regional digests) — all behind the same rule we built the whole hackathon version around: agents can find and propose, only people approve.
