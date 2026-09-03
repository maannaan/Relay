# 3-minute submission video script

Record the agent side in whatever tool you actually test with (ChatGPT's in-app browser is the target; Codex or another agentic browser works as a stand-in if needed — say so on screen if it's not ChatGPT). Screen-record both the agent chat and the Relay tab, side by side, exactly like your working test session looked.

Before recording: reload Relay at the live URL, click **Reset demo**, and don't enable `?demo=1` unless you specifically want to show the Diagnostics panel in step 5.

---

**0:00–0:20 — The problem, cold open, no narration over a logo**

Show Relay already open, scrolled to the Risk Radar / focus panel with the fridge risk selected — "Walk-in fridge temperature," red dot, "Missing: owner, deadline, fallback," and the "The missing hour" callout visible.

Voiceover (calm, not salesy):
> "It's 9:52 PM. The walk-in fridge stayed at 9 degrees after a door repair. Someone wrote it down. Nobody's assigned to check it before tomorrow's open. That gap — between a note existing and someone actually owning it — is the missing hour. Relay won't call a handoff safe until it's closed."

**0:20–1:10 — The agent reads, doesn't guess**

Cut to the agent chat. Type a prompt close to what you actually tested:
> "This is Relay, a shift-handoff tool for a café chain. Check whether any of our locations have a closing handoff that isn't safe to leave for tomorrow, and if so, fix it."

Let it run. Show the Relay tab updating live as the agent works (if your tool exposes a visible browser pane, keep it in frame). Voiceover over the wait:
> "Relay doesn't hand the agent a dashboard to click through. It exposes real tools — list locations, read shift context, find what's unowned, read the raw closing notes. The agent has to actually reason about what it's reading, not fetch a label someone pre-computed."

**1:10–1:55 — The agent proposes, doesn't decide**

Show the agent's response: it identifies the fridge risk, drafts a recovery plan (owner, deadline, fallback), and explicitly asks for approval. Cut to Relay showing the same draft live in the UI — amber "Awaiting manager approval."

Voiceover:
> "It found the risk, and it proposed a plan — an owner, a 7:30 AM deadline, a fallback if the temperature's still high. But it stopped there. There's no tool it could call to approve this itself."

Optional, if you captured it: show the moment you asked the agent to confirm it was verified *before* approving, and it correctly said no — audit trail has no approval event. This is your strongest, least-fakeable moment. Include it if you have it.

**1:55–2:30 — The human closes the loop**

On screen, in Relay: click **Approve this handoff** yourself. Show the status flip to "Handoff verified," green, and the fridge marker on the Ownership Horizon turn from red/amber to lime.

Cut back to the agent chat: ask it to confirm again. Show its correct answer — verified, with the real audit details (who approved, when, what was assigned).

Voiceover:
> "Only a person can close that gap. The agent proposes; a manager decides. Once I approve it here, the agent can see that — and only that — as done."

**2:30–3:00 — Proof, scale, and the close**

Quick cuts:
- Switch to Park Street Coffee — show it's already verified, a second location the agent could have checked instead.
- Show the Audit Trail panel — every entry, timestamped, with a real actor (Rohan, Nisha, Relay, or you).
- Optional: Diagnostics panel with the tool-call log, proving these were real WebMCP calls, not scripted UI clicks.

Voiceover, closing:
> "This is Relay — every risk gets an owner, a deadline, and a fallback, or the handoff isn't safe. Built on WebMCP, so any agent that visits the page can help close the gap — but only a person can say it's closed."

End card: live URL + GitHub link.

---

## Shot list checklist

- [ ] Cold open: blocked state, "missing hour" callout visible
- [ ] Agent prompt + it discovering/reading tools (show the wait, don't cut it entirely — a few seconds of "thinking" reads as real, not staged)
- [ ] Agent's draft proposal + Relay UI updating live to match
- [ ] (Strong if you have it) Agent correctly refusing to claim verified before approval
- [ ] Your own click on Approve, visibly, in Relay
- [ ] Agent correctly confirming verified + accurate audit details afterward
- [ ] Second location (Park Street) for scale
- [ ] Audit trail full view
- [ ] End card with live URL
