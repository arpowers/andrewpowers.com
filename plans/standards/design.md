# Design Standards

PageLines uses Apple HIG-inspired humanist minimalism: clear Swiss grids, Tufte data discipline, Jony Ive restraint, and Krug *Don't Make Me Think*. The UI is quiet, tactile, friendly, and useful; never brutalist, flat for its own sake, or clever.

> **First-principles lens.** Before any rule here, the [7th Operating Principle](first-principles.md#pagelines-operating-principles) test: *would a non-technical first-time visitor understand this screen in 30 seconds — what it is, what to do, where value lives?* If not, nothing else matters yet.

## Quick Reference

| Aspect | Standard |
|---|---|
| **Schools** | Apple HIG, Swiss grid clarity, Tufte, Jony Ive, Krug |
| **Body / Title / Code** | Inter (`font-sans`) / Inter bold (`x-font-title`) / SF Mono (`font-mono`) |
| **Font weights** | `font-medium`, `font-semibold` only — never `bold` / `black` |
| **Border radius** | `rounded-2xl`, `rounded-3xl`, `rounded-full` only |
| **Depth** | Opaque content, translucent chrome, soft shadows only for physical layers |
| **Transitions** | `transition-colors` only — never `transition-all` |
| **Touch targets** | ≥ 44 × 44px |
| **Color** | 2–3 colors max; color is meaning, never decoration |
| **Layout** | Flush-left ragged-right; 8px baseline grid; generous whitespace |

### Forbidden by default

`font-bold` / `font-black`, decorative `shadow-*`, `rounded-sm` / `-md` / `-lg` / `-xl`, `transition-all`, raw `<button>`, dynamic Tailwind class strings (`` `bg-${x}-500` ``), gradients on UI elements, `bg-primary-*` for containers, hardcoded hex / `bg-blue-*` / `text-gray-*` over the semantic palette.

### Mindset

Clarity over cleverness. Warmth over austerity. Purpose over decoration. One action at a time (Typeform model). Show explicit user-initiated actions — never silent magic. Specificity over superlatives.

### PageLines aesthetic

Use Apple HIG as the emotional baseline and Swiss design as the organizing discipline. Minimalism raises the burden on spacing: between-group distance must exceed within-group distance, transcript turns need clear Gestalt separation, and rich data blocks need enough whitespace to read as embedded objects instead of prose.

Depth communicates hierarchy, not decoration. Navigation bars and compose chrome may use material, blur, and translucency because they sit above scrollable content. Message bubbles, tables, charts, code blocks, and other generated content stay opaque; avoid glass on glass.

Cards and data widgets may use a micro-border, continuous radius, and a soft shadow when they behave like physical layers. Do not add shadows to plain prose, skeletons, or decorative containers. The result should feel tactile and human, not glossy or skeuomorphic.

## The four audits

Every screen ships only after passing four lenses. Each has its own checklist below. Run all four during design review and any UI refactor.

| Lens | Asks | Schools |
|---|---|---|
| **Action Feedback Contract** | Does the user know what's happening? | Nielsen visibility-of-status, Krug |
| **Composition Audit** | Does the surface guide them to it? | Krug 5-sec, Nielsen F/Z, Müller-Brockmann grid, Gestalt proximity, Bringhurst, Travis red routes, Hick's & Fitts's |
| **Language & Mental Model** | Do the words match the user's model? | Nielsen match-real-world + recognition + progressive-disclosure, Strunk + BLUF |
| **Animation Audit** | Does motion clarify behavior? | Material spatial continuity, Disney anticipation, reduced-motion |

## Action Feedback Contract

Every user-triggered action — click, submit, drag, keyboard shortcut — owes the user three things in order: **acknowledgment** (it registered), **progress** (it's working), **outcome** (worked / failed, with next step). Skip any and the user asks *did anything happen?* "The API returned 200" is not an answer — the user can't see your network panel.

This is *Don't Make Me Think* operationalized for behavior over time. Run on every interactive control during design review and any UI refactor.

### Action ≠ button

The contract covers every user-initiated change of state, not just clicks. Enter-to-send, autosave-on-blur, drag-drop, toggle, tab change, search-as-you-type, infinite scroll — same six questions, different surface. Don't audit only the buttons.

A useful frame: Nielsen's *Visibility of system status* — every state change the system makes in response to the user must be observable within a perception window (~100ms acknowledge, ~1s progress hint, structured progress beyond ~10s). If the user can't see it, it didn't happen.

**Sending a chat message is the canonical mis-audited action.** Enter is the primary path, the button is secondary; both go through the same handler and must surface the same six feedback steps. Errors that log to console and dead-end the conversation (the bug we just fixed) are the failure mode.

### Two duration tiers

| Tier | Duration | Feedback shape |
|---|---|---|
| **Short** | < 15s, or synchronous | Button-local spinner (`<FButton :loading>`) + an out-of-flow acknowledgment on completion (toast, route change, inline label) |
| **Long** | ≥ 15s, or unknown | Page-owned progress surface (`FProgress` + the `useAgentTransition` pattern). The button hands off; a section of the page displays structured progress that survives the user moving around inside the page. |

**Default when duration is unknown: treat as long.** A "usually fast" button (rebuild, bulk write, fleet sweep) becomes a UX bug the moment Fly.io or Stripe is slow. Cheap to start with progress; expensive to add it after a complaint.

### The action audit

When auditing or refactoring a screen, run this on every user-triggered control. A control failing any of the six is unfinished, even if the API call works:

1. **Acknowledge** — At t+0ms, does the user see the click registered? (button disabled, spinner, immediate visual change)
2. **Progress** — Does the feedback intensity match the duration tier above?
3. **Outcome** — On success, what changes that the user can perceive? Toast, redirect, list update, badge — name the surface.
4. **Failure** — On failure: (a) failure visible, (b) message says *why* in user terms, (c) next step obvious?
5. **Location** — If the action conceptually moves the user ("I rebuilt the server"), does the UI move with them? A stale page reads as nothing happened.
6. **Recovery** — Is there a way out of the resulting state without a page reload?

### The feedback toolbox

Pick the surface that matches the cost of breaking the user's flow. Reach for the *lightest* surface that still does the job — heavier surfaces (modals, banners) are taxes paid by every reader who didn't trigger the action.

| Surface | When | Flow cost | Component |
|---|---|---|---|
| **Button loading state** | Always, while a click is in-flight | None | `<FButton :loading>` |
| **Toast (out-of-flow)** | Success acknowledgments, soft errors, background events the user didn't ask about | Lowest — ignorable, non-blocking | `envClient.notify({ type, message })` → `NotifyToaster.vue` |
| **Inline status / banner** | Section-level state that must persist until resolved | Low — visible without taking over | `FNotifyBanner.vue` |
| **System message** | Errors / status inside conversational surfaces | Low — fits the surface's grammar | chat system bubble |
| **Route change** | Action conceptually relocates the user (rebuild → overview, delete → list) | Low if expected | `envClient.nav.updateUrl` / `navigate` |
| **Status chip / dot** | Persistent state users glance at repeatedly | None — passive | `<AgentStatusStrip>` |
| **Page-owned progress hero** | Long-running ops the page is canonically about | Low — user expected this when they triggered the action | `FProgress` + `useAgentTransition` |
| **Confirm modal** | Inadvertent click could cause an irreversible action OR the user wouldn't understand the consequence — see rubric below | Highest — blocks everything | `envClient.confirm({...})` → `FConfirm.vue` |

**Toasts are underused.** Most "the save worked" / "the change applied" feedback should be a toast — fire-and-forget via `envClient.notify(...)`, ignorable, don't break the user's current task. Their value is being **out of flow**: they let us avoid in-app notifications that interrupt what the user was doing. Reach for inline banners only when the state must persist until acted on.

### Confirm modal — when to use

A confirm modal is the heaviest feedback surface — it freezes the user's flow and demands a decision. Reach for it **only** when one of the following is true. If none apply, the action stays a single click; pair it with a toast and an `Undo` if it's reversible.

**Use a confirm modal when:**

1. **Inadvertent click could cause irreversible action.** Click target is conventionally low-stakes (a top-right X, a list-row tap, a kebab menu item) but the consequence isn't reversible by the same kind of low-stakes click. Example: dismissing the onboarding checklist via the X icon — the X reads as "close" but writes a DB column with no obvious recovery path, so a confirm is correct.
2. **User likely wouldn't know the consequence.** Action's name doesn't fully telegraph what it does, or the side effects extend beyond the visible surface. Example: "Rebuild server" sounds like a refresh; the actual cost is ~1 minute of downtime, fresh tokens, lost in-memory state. The confirm body is where you teach the user.
3. **Side effect is asynchronous and visible to others.** Sending an email, posting to a channel, charging a card — anything where "Oh wait" can't be undone client-side because the network already saw it.
4. **The action is destructive AND the user can't recover by re-doing the same action.** A delete that nukes downstream data, a payment-method removal that affects an active subscription, a key rotation that invalidates issued tokens.

**Don't use a confirm modal when:**

- The action is reversible by the user clicking the same button again (toggle, archive/unarchive, mute/unmute) → ship the action + an undo toast if recovery isn't obvious.
- The action's name fully describes its consequence and the click target is deliberate (a button labeled "Delete", with a trash icon, after the user navigated to a Danger Zone) → in-place type-the-name confirmation is heavier than a modal but more grippy when the consequence is total. Use that for nuke-it-from-orbit deletes; reserve the modal for the rubric above.
- The action is part of a flow the user is already committed to (Step 3 of 4 in a wizard) → confirms here read as the system second-guessing the user.

**The component contract.** Use `envClient.confirm({ title, body, confirmLabel, cancelLabel, theme, icon, testKey })`. It returns `Promise<boolean>` — same ergonomics as `window.confirm()`. Drop-in for any call site that currently uses native confirm. The host (`FConfirm.vue`) is mounted globally beside `NotifyToaster`, so call sites never instantiate or import a modal. E2E selectors are derived from `testKey` (`<testKey>-confirm` / `<testKey>-cancel`).

**Why not native `window.confirm()`.** Browser dialogs ignore our design system, can't carry icons or rich copy, and aren't testable through Playwright's normal selectors (you have to register a dialog handler instead of asserting on a real button). The `envClient.confirm()` API matches its ergonomics — `await` returns a boolean — so there's no excuse left to reach for it.

### State honesty — blockers narrate, never explain infrastructure

Every state that can block the user's job — billing decline, service connection expiry, server cold-start, asleep assistant, permission denied, rate limit, model 5xx — owes the surface three things: **a name** (in the user's language, not the system's), **one recovery action** (not an explanation of what failed), and **persistent visibility without taking over**. State is *visually subordinate* — it never out-weighs the primary action of the page — but *always available* — the user can see and act on it without hunting.

> See [`story-mapping.md → Recovery states as first-class story branches`](story-mapping.md) for *which* blockers belong on each batch's red route. This subsection is *how* to render them.

**Three rules, in order of importance:**

1. **One recovery action, not an explanation.** Blocker copy is *"Reconnect Gmail"*, not *"OAuth refresh failed: invalid_grant (400)."* The user does not own the failure mode; they own the next step. If recovery requires more than one click, name the first click and lead them through. Cross-link: [`first-principles.md → State explanations never dead-end`](first-principles.md).
2. **No infrastructure language in user-facing copy.** *"Provisioning,"* *"instance,"* *"VM,"* *"endpoint,"* *"upstream,"* *"503,"* *"timeout,"* *"webhook"* — none of these belong on the user's surface. The agent is *waking up*, *going to sleep*, or, on owner/admin recovery surfaces, *rebuilding*; it is not *re-provisioning a VM*. The card was *declined*, not *the Stripe webhook returned status 4*. See [`Language & Mental Model Audit`](#language--mental-model-audit) for the full ban list.
3. **Subordinate weight, persistent visibility.** A blocker banner does not out-weigh the page's primary action. It uses lower saturation, smaller type, never the primary brand color (reserved for the one action the page is canonically about). It stays visible until resolved — banners persist; toasts vanish. The *Squint test* applies: blurring the page, the blocker should still be *findable*, never *dominant*.

**Surfaces, by blocker type:**

| Blocker | Where it surfaces | Why |
|---|---|---|
| **Billing decline / unpaid** | Account-level banner on every authenticated page + system message in chat | The job is fully blocked; user must see it on every surface they land on. |
| **Service connection expiry / unpaired service** | Inline on the agent's overview + system message when the agent attempts the action | The user can keep working in unrelated tools; only the blocked path needs surfacing. |
| **Server cold-start / asleep agent** | Status chip + button-local progress + system message ("waking up — back in 10 seconds") | Predictable wait, narrate it, the agent speaks the state itself. |
| **Bot connectivity degraded** (heartbeat stale / proxy unreachable) | Status chip flips amber/red on existing surfaces — *no new banner* | Server projects heartbeat into `lifecycle='degraded'` or `lifecycle='unreachable'`; clients still branch on one status field. See [`architecture/bot-state-management.md → Heartbeat Projection`](../architecture/bot-state-management.md). |
| **Permission denied** | System message in the surface where the request was made | Local to the failed action; full-page banner is overkill. |
| **Rate limit / model 5xx** | System message + retry timer | Transient; never silent failure or gaslit success. |

**Severity does not justify a second client state axis.** Connectivity failures are server-derived lifecycle values (`degraded` / `unreachable`) because clients need typed color/copy branching. Smaller reasons stay in `detail`: render the string, never branch on it. Add a new lifecycle value only when the client behavior is materially different.

**The agent narrates its own blockers and learning.** When the failure is the agent's (it can't read the inbox, can't reach the model), the agent *speaks* the state in chat in its own voice — not a system error bubble. When it learns a useful preference or standing order, it says what changed in plain language. *"Cicero: My Gmail connection expired. Reconnect here?"* and *"I saved that as your follow-up style for next time"* are agent behavior; *"system prompt updated"* is infrastructure leakage.

**Anti-patterns:**

- A modal blocking the page on a billing decline. Modals stop workflow; billing recovery is a one-click handoff to Stripe portal — banner + button is enough. Modals are reserved for irreversible decisions ([Confirm modal — when to use](#confirm-modal--when-to-use)).
- A toast for a state that persists. Toasts vanish; persistent state needs a banner or a status chip, or the user comes back tomorrow and finds nothing.
- Two surfaces narrating the same blocker with different recovery actions (a banner says "Reconnect Gmail", a system message says "Contact support"). One blocker, one recovery, every surface that mentions it agrees.
- Generic "Something went wrong — try again later" copy. Either the system can name the state (then name it) or it can't (then surface what action the user can still take). Vague copy is a confession that the failure mode wasn't designed for.
- Status pages buried under "Settings → Health." Status the user needs is on the page they land on; status the operator needs is in observability tooling, not the dashboard.

### Companion techniques

- **Spinner localization.** A loading indicator lives on the *exact* control the user activated. If two buttons on the page do the same thing, only the clicked one spins. Pattern in this codebase: `actionInProgress = ref<'rebuild' | null>` + `:loading="actionInProgress === 'rebuild'"` per button. A shared `:loading="working"` boolean across twins is the anti-pattern — both spin, the user can't tell which one they hit.
- **Idempotent retry.** Disable the control while in-flight. A second activation during an open request is a no-op, not a double-submit.
- **Optimistic updates.** For changes that almost always succeed (toggle, rename), apply locally first and revert on failure. Perceived latency → 0.
- **Skeleton over spinner for predictable layouts.** A skeleton tells the user the shape they're about to see; a spinner only says "wait."
- **Undo over confirmation.** For reversible destructive actions, ship action + undo toast (5–10s). Lower flow cost than "Are you sure?" with the same safety. For irreversible actions or low-stakes-click → high-stakes-consequence pairings, use the confirm modal — see [Confirm modal — when to use](#confirm-modal--when-to-use).
- **Don't lock the page.** Long actions surface progress in a section, not behind a full-page block. The user keeps navigating within the page while work runs.
- **Focus return.** After a dialog closes, focus returns to the element that opened it. Keyboard and screen-reader users lose context otherwise.
- **State-machine completeness.** Every discriminated union the UI consumes (`connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error'`) must have a user-visible distinction per variant. Variants with no view are dead UX — collapse the state or add the view. Pin with a test that enumerates each variant.

### Working examples in this codebase

Reach for these before inventing new shapes:

- **Per-action spinner localization** — `AgentAdvancedSection.vue`, `AgentServerModalContent.vue` (`actionInProgress` key + `:loading="key === 'rebuild'"`)
- **Long-action progress hero** — `useAgentTransition` + `FProgress` in `AgentOverviewSection.vue`
- **Out-of-flow toasts** — `PairingModal.vue`, post-rebuild in the agent admin (`envClient.notify`)
- **Confirm modal** — `provisioner/client.ts → performRecreate` (rebuild gate), `AgentOverviewSection → handleDismissClick` (dismiss onboarding) via `envClient.confirm`. Both replaced `window.confirm()`; both still gate, both now testable.
- **Rebuild handler composable** — `agent/admin/useAgentServerActions.ts` shared between `AgentAdvancedSection.vue` and `AgentServerModalContent.vue`. Pure-with-DI, three-call-sites bar met before extraction.
- **Autosave "Saving / Saved" pill** — `AgentClient.saveButton` getter, driven by `AutosaveUtility`
- **Persistent state chip** — `AgentStatusStrip` (online/offline/error)
- **Conversational system message** — `ElAgentChat.vue` system bubble (errors and `working_state` events)

### When to apply

- **Every PR that adds or modifies a user-triggered action.** Run the audit before merge.
- **Every design review or UI refactor round.** Run on every action on the surface; cross-reference [`refactoring.md → UI / design refactors`](refactoring.md).
- **Anytime a user reports "did it work?" / "page just sat there" / "I had to refresh."** That's the contract skipped on at least one path.

## Composition Audit

Companion to the Action Feedback Contract. Where that asks *does the user know what's happening*, this asks *does the surface guide them to it*. Run on every screen during review or refactor.

**Five-second test (Krug, *Don't Make Me Think*).** A stranger glancing at the surface should answer *what is this*, *what's the one thing to do*, *where do I go next*. Composition that hides any of those fails the [7th Operating Principle](first-principles.md#pagelines-operating-principles) bar — pixels don't matter yet.

### Audit lenses

**Hierarchy — the squint test.** Blur your eyes. Title, primary action, content boundary should remain distinguishable. If everything blurs to one tone, contrast is flat. *Three-level rule:* one primary, two secondary, the rest tertiary. Four primaries = no primary. Hierarchy through size / contrast / spacing — never color (color is meaning, see [Color System](#color-system)) or weight stacking.

**Weight ↔ importance.** The heaviest element matches the action you most want taken. A decorative image out-weighing the primary CTA is cheap-template smell.

**Eye path (Nielsen F / Z).** Content-dense surfaces read F (top-left, scan right, drop, scan again). Sparse surfaces read Z (across top, diagonal, across bottom). Trace the path; the primary action sits on it. First fixation lands on title or CTA, never chrome.

**Rhythm — Müller-Brockmann grid.** Sample three random vertical gaps; all multiples of 8. Drift means hand-tuned margins. Dominant blocks (sidebar:content, header:body, hero:rest) honor the golden ratio. If you're nudging by 1–2px to feel right, the grid is wrong, not your eye.

**Whitespace — Gestalt proximity.** Between-group space > within-group space, every time. If gap-between ≤ gap-within, the boundary is ambiguous. Use space before borders — a 32px gap separates more honestly than a 16px gap with a divider through it.

**Alignment — left default.** Flush-left ragged-right for prose, headlines, and any multi-line copy. Center only short single-token labels (chip text, divider tokens like `OR`), symmetric button stacks, and rare hero moments. Centering moves the left edge per line, so the reader's return-sweep becomes a search instead of a snap — auth screens, settings, headlines + supporting copy → flush-left. Optical alignment beats mathematical (icons overhang the box; trust the eye).

**Hero subtitles — remove first, clamp when needed.** A hero should usually stand on title, status, and action. If the subtitle only restates the title, delete it; Swiss restraint beats explanatory chrome. Keep a subtitle only when the user needs context to decide safely — restart consequences, irreversible actions, plan limits, compliance notes. Required hero subtitles are two lines max (`line-clamp-2`) and visually secondary. If context needs more than two lines, move it below the hero into details, help text, or a confirmation body.

**Reading — Bringhurst 45–75.** Measure the widest text block. Outside that range, the next-line return-sweep fails. Long lines need taller leading, but the cap is real.

**Red routes (Travis).** Name the one path 80% of users walk. From a cold start, can a stranger walk it in five seconds without help? Anything (banner, sidebar, secondary CTA) visually competing with it is taxing every visit.

**Cognitive load.** *Hick's Law:* decision time grows with options — three primary actions max per surface; group the rest behind one CTA. *Fitts's Law:* the most-clicked target is the largest *and* nearest the resting position. Tiny "Save" buttons in corners violate both.

### Composition checklist

Run on every surface. Two or more fails = unfinished, regardless of fidelity.

1. Squint — title, primary CTA, content boundary still distinguishable?
2. Trace F or Z — primary action on the path?
3. Three random vertical gaps — all multiples of 8?
4. Two adjacent groups — gap between > gap within?
5. Widest prose block — under 75 chars?
6. Red route — findable in 5s without help?
7. Primary CTAs on this surface — ≤ 3?
8. Heaviest element — matches the most important action?

## Language & Mental Model Audit

The target user is **non-technical, non-enthusiast** — they hired an assistant to handle email, not to learn what a VM is. Audit every visible word against the model the user actually has of the product.

Reference [`writing.md`](writing.md) for the canonical copy patterns; this audit is the lens that catches drift during design review.

### Audit lenses

**Match between system and the real world (Nielsen).** The word the user uses is the word we use back. Users say "my assistant"; we don't say "the agent instance," "the bot VM," "the runtime." Implementation words leak only into dev-facing surfaces (fleet, logs, admin). Audit move: list every visible word; flag any a stranger would pause on.

**Anthropomorphize the assistant, not the infrastructure.** The assistant has a name, a status the user can read in human terms, and a voice. The infrastructure does not. Lifecycle verbs describe what the *assistant* is doing (sleeping, waking) except on owner/admin recovery controls, where *Rebuild* is allowed because it names the job: update config/image while keeping files. *"Your assistant is waking up"* beats *"Provisioning Fly machine in LAX."* If you're tempted to surface a process, surface the *thing* instead.

**Recognition over recall (Nielsen).** Show the choice; don't make the user remember it. `@Sarah`, not `@usr_VVT8r…`. Suggested actions beat blank inputs. Persistent labels beat icon-only chrome unless the icon is universal (search, close, menu).

**Plain language (Strunk + BLUF).** Lead with the answer. Cut hedges and nominalizations ("perform a restart" → "restart"). Errors voiced *to* the user *about* the system, not raw machine output: *"We couldn't reach your assistant — try again in a minute"* beats *"Failed to fetch: ECONNREFUSED."*

**Curse of knowledge.** Engineers systematically underestimate jargon. Stranger test: would a first-time visitor pause on any word? "Provision," "OAuth," "endpoint," "webhook," "deploy," "instance" are usual suspects. Replace with everyday words; keep the precise term only when no plain substitute exists *and* the user must understand the distinction.

**Progressive disclosure (Nielsen).** Default state simple; detail on demand. Pill says "Ready"; tap to see "Gmail connected; Slack handoff ready." Most users never tap; the ones who need detail get it without polluting the default surface.

**Voice (Mailchimp/Buffer style guide tradition).** Warm, direct, never cute. Sentence case for buttons and labels (Title Case is for proper nouns and feature names). All-caps reads as shouting outside small uppercase chips. Periods inside short button labels read as drag — drop them.

### Language checklist

For every surface:

1. Any visible word a non-engineer would pause on?
2. Any user-facing leak of "VM," "instance," "deployment," "endpoint," "OAuth"?
3. Does the assistant feel like a *thing* with a name and status — or a process?
4. Errors voiced to the user, in their words, with a next step?
5. Any IDs visible the user would never type or remember?
6. Sentence case outside proper nouns? No periods on short labels?
7. Default surface simple; detail behind progressive disclosure?

Two or more fails = the surface is leaking implementation. Refactor toward the user's mental model, not the engineer's.

## Animation Audit

Smallest of the four lenses. Animation is purposeful or absent — there is no neutral middle. Run on every transition, hover, modal, page load, list reorder.

**Two questions, run together:**
- *Does each existing animation answer a question?* (where did this come from / where did it go / did my action register / is the system working) — if not, cut it.
- *Where on this surface would subtle motion clarify behavior?* (modal expanding from its trigger, list item briefly highlighted on arrival, focus pulse, error-shake on bad input) — if there's a slot, add it.

### Audit lenses

**Spatial continuity (Material).** Motion shows where things came from. Modals expand from the button that triggered them; drawers slide in from the edge they live on; deleted rows collapse rather than vanish. Motion that fights spatial intuition reads as glitch.

**Motion as feedback (Disney *anticipation* + *follow-through*).** A button compresses on press; an arriving row briefly highlights; an input shakes on validation failure. Micro-interactions reinforce affordance — the surface acknowledges the user.

**Timing tiers.** UI transitions 150–300ms. Content / page transitions ~500ms. Anything past ~1s gets a progress surface (see Action Feedback Contract). Outside these windows = jarring (too fast) or sluggish (too slow). `transition-colors duration-200` is the dashboard default; named keyframes only when needed.

**Easing direction.** Ease-out for incoming (welcome the change). Ease-in for outgoing. Linear only for indeterminate spinners. `ease-in-out` is a hedge — pick a side.

**Standard easing curve — `cubic-bezier(0.25, 1, 0.33, 1)`.** Project default; use this everywhere instead of Tailwind's `ease-in` / `ease-out` / `ease-in-out`. It's a soft "out-quint"-style curve — fast initial response (the user's input is acknowledged immediately) followed by a long, smooth deceleration that feels expensive without being slow. The Tailwind defaults are too linear and read as cheap; this one is the difference between a hover that feels responsive and a hover that feels engineered.

```html
<!-- ✅ Use the project standard -->
<div class="transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.33,1)] hover:scale-105" />

<!-- ❌ Don't reach for the Tailwind defaults -->
<div class="transition-transform duration-300 ease-out hover:scale-105" />
```

Pair the curve with the appropriate timing tier: 200–300 ms for state flips (focus, hover-color), 400–600 ms for visual reveals (cover-image scale, gradient fade), ~700 ms ceiling for hero motion. Past that range the curve's tail starts to feel like lag — switch to a tighter timing rather than a different curve.

**Reduced motion.** Honor `prefers-reduced-motion: reduce`. Cross-fade in place of movement; keep the duration. Accessibility is a feature, not an opt-in.

### Loading rule — `<FSpinner>` alone, no copy

For transition states (auth → redirect, page-to-page nav, deferred component mount, mode flips, suspense boundaries) use `<FSpinner>` and nothing else. No "Loading…" text, no card frame, no skeleton chrome. The spinning ring is the signal; copy reads as friction, a card around it reads as a decision pending. The beat is short by definition. Canonical: `AuthView.vue` success state.

### Streaming cadence — text reveals at a reading pace, never instant

Streamed AI replies must *type in* at a readable cadence — never appear fully-formed in one jump. The model and the transport are bursty: tokens arrive in clumps, and a short reply can land in one frame. Rendering received text immediately makes the bubble *pop* — the reply feels abrupt, the user can't tell it was generated, and there's no sense of a thought forming. Decouple **receipt** from **display**: accept text as fast as it streams, but reveal it at a steady pace with only enough catch-up to stay close on a big burst.

- **Floor pace ≈ a fast reader.** ~80–100 chars/sec is the readable baseline; below that it drags, above it stops reading as "typing." Reveal character-by-character (or word-by-word), not chunk-by-chunk.
- **Bounded catch-up, not instant drain.** When the backlog is large (a whole reply arrived at once), accelerate only enough to finish within ~1.5s. A hard "show everything now" defeats the point; an uncapped steady pace makes a long reply crawl.
- **The final frame doesn't cut the reveal short.** When the canonical/complete message lands while the reveal is mid-flight, hold it and let the pump finish, then swap — otherwise a burst-then-final sequence snaps to full text and you've lost the cadence on exactly the fast replies that needed it most.
- **Reduce Motion reveals instantly.** A typewriter is motion; honor `prefers-reduced-motion` by showing the full text at once. Same rule as every other animation here.

iOS realization: `ChatScreenViewModel`'s reveal pump (`receivedContent` → paced `assistantLiveTurn.content`, `pendingFinalMessage` held until catch-up). The web messenger applies the same decouple-receipt-from-display rule.

### Skeleton heuristics — honest scaffolding, not decoration

Skeletons are for predictable layouts where the user benefits from seeing the *shape* of what's coming. They are scaffolding, not content. Hand-built skeletons drift from their loaded view; prefer a redacted/shimmered render of the real subtree where the framework allows it.

- **Honest structure.** Match the loaded view's proportions, hierarchy, and vertical rhythm. A skeleton that doesn't predict the final layout is lying — and pays for it with a jump on load.
- **Grid before everything.** Widths, heights, and gaps land on the 8px baseline. Arbitrary measurements break the system silently.
- **Neutral palette only.** `theme100`/`theme200` (or the dark-mode equivalents). Brand color, warmth, or saturation in a skeleton is a category error.
- **Geometric primitives.** Rectangles and circles. No gradients, no shadows, no borders, no pills standing in for unknown content.
- **Asymmetric rhythm.** Vary bar widths so the placeholder reads like real prose; identical bars feel mechanical and dishonest.
- **Negative space is content.** Show only what will land in the visible area. Sparse reads as confident; crowded reads as filler.
- **One motion pattern, system-wide.** Shimmer *or* pulse, never both. If you notice the motion, it failed its job.
- **Anchor where the loaded view anchors.** A bottom-anchored transcript needs a bottom-anchored skeleton — settle direction is part of the layout.
- **Cross-fade, not reveal.** Handoff to content is instant or a quiet cross-fade ≤200ms. Elaborate transitions undermine everything that came before.
- **Reduce Motion stays static.** Static placeholders carry the loading signal on their own; the breathing gradient is the addition, not the foundation.

### Animation checklist

1. Every existing animation answers a question — or it's cut?
2. Any "where did this come from?" moment without continuity? Add motion.
3. Any user input without micro-feedback (press / shake / pulse)? Add it.
4. Timing in tier (150–300ms / ~500ms / >1s gets progress)?
5. `prefers-reduced-motion` honored?
6. Loading states use bare `<FSpinner>` — no labels, no chrome?

## Color System

Color carries meaning, never decoration. Two semantic palettes — `primary-*` (interactive: CTAs, focus, links, brand accents) and `theme-*` (surfaces: backgrounds, text, borders, disabled, secondary UI). Both run a 0–1000 scale (0–100 lightest, 900–1000 darkest). Status colors (red, amber, green) earned, never decorative — see [Forbidden by default](#forbidden-by-default).

```css
/* ✅ Semantic */
bg-primary-500   text-theme-500   border-primary-200

/* ❌ Hardcoded */
bg-blue-500   text-gray-500   border-red-200
```

```ts
const buttonClasses = {
  'primary-solid': 'bg-primary-500 border-primary-600 text-white hover:bg-primary-600',
  'default-solid': 'bg-theme-100 border-theme-300 text-theme-900 hover:bg-theme-200',
}
```

## Typography

Titles → `x-font-title` (Inter bold, weight 700, tight tracking). Body → `font-sans` (Inter, used for all prose). Code → `font-mono` (SF Mono, only inside `<code>` / `<pre>`). Hierarchy from size, not weight stacking — `font-medium` and `font-semibold` only.

```vue
<h1 class="x-font-title text-theme-900 text-fluid-title">Main Title</h1>
<p class="text-theme-700 text-fluid-body">Body content</p>
<code class="font-mono text-theme-600 text-sm">code snippet</code>
```

Fluid scale via `text-fluid-*` (display / title / heading / subhead / body / small) for responsive sizing; raw `text-xs … xl` for fixed contexts. Line length 45–75 chars (Bringhurst); longer lines need taller leading. Type ratio ≈ golden (16 → 26 → 42).

## Layout

Audit angles live in the [Composition Audit](#composition-audit). Canonical rules below.

- **8px baseline.** All vertical spacing is a multiple of 8 (`space-2 / 4 / 6 / 8 …`). Drift = hand-tuned margins crept in.
- **Asymmetric flush-left.** Prose ragged-right, primary actions where the eye naturally lands. Centered text only for short labels or symmetric blocks.
- **Golden ratio on dominant blocks.** Sidebar : content, header : body, hero : rest. `space-8` ↔ `space-5` ≈ 1.6:1.
- **Whitespace before borders.** A 32px gap separates more honestly than a 16px gap with a divider.
- **Subtle tonal gradients only** (white → off-white) for depth — never on UI elements.
- **Hierarchy through size and contrast**, not weight or color. Size matches importance: primary largest + highest contrast, tertiary smallest.

## Icons

Iconify via Tailwind. Prefer `icon-[set--name]` (Tailwind v4); legacy `i-set-name` still works via wrapper plugin.

**Selection priority:** branded over generic. `logos` (multicolor brands) → `simple-icons` (monochrome brands) → `devicon` (dev/tech) → `tabler` (fallback). Every branded icon needs a tabler fallback. Default unknown-service fallback: `i-tabler-puzzle`.

**Sets:** `logos` / `simple-icons` / `devicon` / `tabler` / `heroicons` / `lucide` / `svg-spinners`.

**Service icons** declared in `src/modules/services/pl-*/definition.ts` via `display.icon` + `display.iconFallback`. Verify icon exists before using:

```bash
node -e "const d = require('@iconify-json/SET'); console.log(Object.keys(d.icons.icons).filter(i => i.includes('SEARCH')))"
```

**Rules:** full static class strings only — never dynamic Tailwind (`` `i-${x}` ``).

## Component Design Patterns

### Media Object — image left, content right

Sullivan's *Media Object* (2010) is the spine of every "thing the user owns" listing: avatar / cover on the left, title + secondary line on the right, optional trailing meta. One layout, many objects — assistants, workspaces, team members, invitations, services. Implemented as `ObjectCard` + `ObjectGrid` (`@/ui/common`).

Why the shared shape: a personal assistant, a workspace, and a teammate are all *identity-led* rows. Three bespoke layouts would force the user to re-learn "where does the name live, where does the status live" per surface. One shape × three datasets = the same scanning rhythm everywhere.

Composition rules:
- **Avatar left**, sized for the surface (large on dedicated lists, small on inline pickers). Status dot tangent to the upper-right; an optional sub-mark (e.g. owner avatar on an assistants row) sits tangent to the lower-left.
- **Title + secondary line** stack to the right of the avatar. Title is the object's name; secondary line carries one of: handle, last-message preview, email — whichever is most useful per surface. Two lines max for previews (`line-clamp-2`).
- **Trailing meta** (timestamp, role, plan label) sits top-right as plain low-contrast text — never a chip when one word suffices. Unread / count badges go bottom-right.
- **No cover-image background**. Objects don't *contain* photos to fill — the avatar is the identity. Background covers belong on profile pages, not list rows.
- **No type pill** ("Assistant", "Workspace") inside the row — the section header already carries that. Repeating it inside every row is redundant ink.

Surface-specific projection happens at the call site by mapping the domain entity into a `NavItem`. The card never branches on entity kind.

`@/ui/common/FButton.vue`. Never raw `<button>` with inline icon classes. Props: `icon` (leading), `iconAfter` (trailing), `theme` (`primary`/`default`/`red`/…), `design` (`solid`/`ghost`/`outline`/`link`), `size` (`xxs`–`xl`), `loading`, `disabled`.

```vue
<!-- ✅ icon as prop, theme + design match importance -->
<FButton theme="primary" size="md" icon="i-tabler-rocket" @click="deploy">Deploy & Start</FButton>
<FButton theme="default" design="ghost" size="md" icon="i-tabler-refresh" @click="rebuild">Rebuild</FButton>
<FButton theme="red" design="ghost" size="sm" icon="i-tabler-trash" @click="destroy">Destroy</FButton>

<!-- ❌ raw button OR icon in slot -->
<button class="px-3 py-1.5 …" @click="rebuild"><i class="i-tabler-refresh size-4" />Rebuild</button>
<FButton @click="deploy"><i class="i-tabler-rocket size-4" />Deploy</FButton>
```

`icon` prop only — never `<i>` in the slot. Tabler is the default UI set. Set `:loading` during async ops; bind it to a per-action key, never a shared boolean (see [Spinner localization](#companion-techniques)).

Use Tabler icons as the default UI set. Specific glyph choices (rocket/play/refresh/trash/pencil/etc.) follow existing call-sites — grep before inventing new mappings.

### Inputs

Three-state grammar — at rest, the control is quiet; hover acknowledges your aim; focus shows it's receiving input. One pattern across web and mobile so a control reads the same wherever it lives.

- **Default** — `bg-theme-25`, `border-theme-200`. Reads as *could be edited*.
- **Hover** — background lifts to `bg-theme-0`. Border unchanged. The bg shift alone is the affordance.
- **Focus** — background stays `bg-theme-0`, border promotes to `border-primary-500`. No focus ring — the border-color shift is the focus signal; an additional ring reads as jarring on a quiet surface and stacks two signals for one event. Contrast delta against `bg-theme-0` exceeds 3:1, so accessibility holds.

`rounded-2xl`, `font-mono` for input text (editable vs labels), `transition-colors duration-150`. Implementation in `src/ui/forms/theme.ts`.

**Gotcha — adaptive sizing routes through `inputClass`, never `class`.** `FInput` always wraps its root in `@container/finput` and layers container-query overrides for padding + text on the inner input. Pass via `inputClass` (consumed by text-like inputs through `textInputClasses` + tw-merge); never via plain `class`, which falls through to wrapper-rooted inputs (`InputMedia`, `InputSwitch`) and pads the wrapper itself — visibly indenting the contained tile.

**FFormEngine** at depth 0 renders a `border-theme-100` divider between fields; inputs constrained to `max-w-2xl` (pass `fieldMaxWidth="full"` on surfaces that own the width, e.g. a long read-only webhook URL). **FInput** renders the `description` prop as a `?` help glyph beside the label that reveals the text on hover/focus — not permanent grey ink under every field (Tufte: the explanatory text reveals on demand). `subLabel` is the only always-visible secondary line. **Custom inputs** via `createOption` accept any Vue component — prefer standard `InputText / InputSelect / InputButtons`. For component-typed values, `shallowRef` only.

**Form fields scale with the column, not the viewport.** Settings, onboarding, and modal forms live inside columns whose width depends on visible chrome (collapsible sidebar, right rail, modal max-width). A `lg:` viewport breakpoint scales the label up while the column itself stays narrow — broken rhythm. `FInput` resolves this via `@container/finput`; same shape as `ObjectGrid`. Don't pass `scale="lg"` from the call site to fake big-screen appearance — the container already knows.

### ElTable / ElTableRow

Config-driven faux table (`@/ui/table`) — CSS grid for layout, not `<table>`. `theme="standard"` for data-heavy views (fleet, logs, admin); `theme="item"` for clickable entity lists. **Hover effects require the `clickable` prop** — hover without a click handler lies about interactivity. Cell resolution: named slot → `col.value(item)` → `item[col.key]`.

### Engine Arrays Over Conditionals

Canonical in [`code-style.md → Branching`](code-style.md). Tailwind size scales (`xs: 'px-2 py-1 text-xs'`, …) are the classic case — a static map, indexed by prop, beats a switch.

### Override content, not chrome

Cards, list rows, grid items are the visual consistency layer — never replace them per-feature. Override what's *inside* the container (modal body, card content), not the container. Pattern: `customModal` key on the data model; shared layout dispatches.

```
✅ Standard IntegrationCard → clicks opens modal → custom modal CONTENT for webhooks
❌ Custom WebhookCard replacing IntegrationCard in the grid
```

### Notification banners (FNotifyBanner)

Same chrome as cards — white bg, `border-theme-200`, `rounded-3xl`. Color lives only in the icon, never in background or border (Tufte: a tiny colored mark on a neutral surface; colored backgrounds fight the page and read as ads).

Themes map to icon color only: `success` → green, `info` → primary, `warning` → amber, `danger` → red, `neutral` → theme. Static class maps — never interpolated.

Reserved for section-level events (payment succeeded, server stuck, fleet has orphans). Inline form-field validation stays as subdued `text-red-600` text.

### Empty states & state surfaces — title earns the surface

The shape for page-level state — 404 / 403, fatal load errors, "nothing here yet" empties — is `<Masthead>` (`@/ui/common`). Three heuristics keep it on-brand:

- **Title earns the surface.** A message only goes underneath when it adds information the title can't carry — a recovery hint, a constraint the user has to know. If the title says the whole thing, the message is decorative; cut it. (Tufte data-ink — see also [`ux.md → Data-ink for behavior`](ux.md#data-ink-for-behavior).)
- **No decorative icons.** A user-plus above "Invite teammate", a wifi-off above "Couldn't reach the server" — the words already carry the meaning; the icon repeats it. The only allowed pre-title mark is a real status code the user can act on. Tinted-tile icon wrappers fail twice — redundancy *and* the contrast rule in [Icons on cards](#icons-on-cards--solid-glyph-no-tinted-tile).
- **Backdrop is the consumer's call, never colored.** Plain on dashboard shells; a muted card (`bg-theme-25`) for visual separation inside a tab; a bordered card when adjacent surfaces are also white. Color belongs in the action button, never in the surface.

Action follows the page's red route ([`ux.md → Red routes`](ux.md#red-routes)) — one primary, secondary actions visibly subordinate. Empty-state CTAs are red-route actions for that surface; "Learn more" siblings are almost always cuttable.

### One state signal per section

When a section already carries a state chip (e.g., `<AgentStatusStrip>`'s "Error" / "Waking up" pill), don't duplicate it with an alert icon next to the title or a banner below. Pick one canonical carrier (chip / banner icon / colored field border) and let it be the single thing saying "here's what's wrong." Three renderings of one signal lose authority.

### Icons on cards — solid glyph, no tinted tile

A tinted-background icon tile (`bg-blue-50`) on `bg-theme-25` has almost no contrast — tile disappears, icon floats. Render solid colored glyphs (`text-amber-600`, `text-primary-600`) at `text-2xl`–`text-3xl` directly on the card. One colored mark on a neutral surface — Tufte data-ink.

### Container queries over viewport breakpoints

When a layout's content column has variable width (collapsible sidebar, right rail), `md:` / `lg:` fire on the *viewport*, not the column — `lg:grid-cols-3` renders 3-up even when the column has room for 2.

Wrap the grid in `@container`; use `@md:` / `@4xl:` (container-relative). Viewport breakpoints stay for things that scale with the browser (body text, shell padding). Working uses: `AgentServicesView.vue`, `AgentChannelsSection.vue`, `WorkspaceZeroState.vue`.

### Sizing scale

`xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` — used by every component prop that takes a size.

## Imagery

Two lanes — match the lane to the surface. The humanist-minimal UI provides the quiet canvas; imagery either disappears into function (in-product) or pops against it (marketing). Apple is the reference for both — clean silhouettes, single-color emphasis, warm tactility, and no glossy skeuomorphism or inner-shadow gloss.

**In-product (rare).** Functional, never decorative. If a screen needs filler imagery to feel "complete," whitespace was the right answer. Consistent aspect ratios (16:9, 4:3, 3:2, 1:1), geometric cropping aligned to the 8px grid.

**Marketing / heroes / banners.** Apple's playbook — bright, saturated colors, one strong subject, generous negative space. The imagery sells the product; the surrounding chrome stays quiet. The contrast between bold subject and minimalist UI is the point — diluting either side breaks the effect.

**Avoid AI-slop tech aesthetic.** The test: would this candidate look out of place on apple.com? If yes, regenerate. The drift modes — purple-blue gradients, glowing neon accents, holographic data viz, faux dashboards-as-art, generic 3D shapes, stock-tech imagery — read as generic 2023-SaaS, not us. Reference is Apple product marketing: real subject, warm saturation, quiet chrome.

**Icons follow the same discipline** in both lanes — see [§ Icons](#icons). Tabler default, branded sets for known services, solid colored glyphs over tinted tiles. Humanist minimalism renders one stroke / one fill; Apple discipline keeps it that way.

## Technical Implementation

### Style cascade

Tailwind utility → inline `style` (only when Tailwind can't express it) → `<style scoped>` (only for complex component-specific styles) → global CSS (avoid). Styles live with the component; portability and self-documentation over central stylesheets.

### SDK portability

SDK components (`src/sdk/**`) use Tailwind / inline only. No `globals.css` reliance. **Never** `<style scoped>` with `@keyframes`. Use `currentColor` to inherit.

### Asset generation tooling

**Marketing imagery — Gemini MCP.** Heroes, banners, OG cards, and blog illustrations are generated via the Gemini MCP server, not stock. Workflow:

1. `gemini-image-prompt` — refine the brief into a detailed prompt. Embed the [Imagery](#imagery) rules every time: Apple-style bright saturation, one strong subject, generous negative space, no glossy skeuomorphism / inner-shadow gloss. The prompt is where the brand rules survive — the model won't enforce them on its own.
2. `gemini-generate-image` — produces the candidate.
3. `gemini-start-image-edit` → `continue-image-edit` → `end-image-edit` — iterate (color shifts, composition tweaks) without re-rolling from scratch.

Name files semantically (`hero-onboarding.jpg`, not `image-1.jpg`) and optimize before commit. **Gotcha:** generated images drift toward generic-tech aesthetic by default — apply the [apple.com test](#imagery) on every candidate, regenerate if it fails.

**Icon discovery — Iconify.** Before referencing a new icon, verify it exists with the one-liner in [§ Icons](#icons). Catches typos before `i-tabler-not-an-icon` ships as a blank.

### Mobile-first responsive

Most dashboard interactions happen on phones. Start at `px-4 py-6`, add space at `sm:` / `lg:` / `2xl:`. Common mistake: desktop-first padding (`px-6 py-12`), then wondering why mobile reads cramped.

| Pattern | Recipe |
|---|---|
| Stack → inline | `flex-col sm:flex-row` |
| Hide secondary actions | `hidden sm:inline-flex` |
| Progressive padding | `px-4 sm:px-6`, `py-6 sm:py-12 lg:py-24` |
| Avatars / icons | `size-14 sm:size-16 lg:size-24` |
| Titles | `text-lg sm:text-xl lg:text-2xl` |
| Full-width CTAs | `w-full sm:w-auto` |

**Don't stop the scale at `lg:`.** MacBook 16" sits at `xl` (≥1280px); 24"+ externals at `2xl` (≥1536px). Without a `2xl:` jump titles and padding read cramped. Audit the full chain — title → tabs → cards → sidebar → footer; a single link left at `lg` breaks the rhythm.

### Edge-Bleed Horizontal Scroll for Action Rows

Coinbase pattern for secondary actions on mobile when a vertical stack would push the fold too far. The scroll container bleeds to the screen edge so the last tile visibly fades off, signaling scrollability without a scrollbar:

```vue
<div class="lg:hidden pt-5 pb-2">
  <div class="flex gap-3 overflow-x-auto no-scrollbar px-6 snap-x">
    <button class="snap-start shrink-0 w-36 h-20 rounded-2xl bg-theme-50 ...">
      <i :class="icon" class="size-5 text-theme-700" />
      <span class="w-full text-sm font-semibold truncate">{{ label }}</span>
    </button>
  </div>
</div>
```

**Rules:**
- First tile starts at the parent's padding (`px-6`); the row runs under the viewport edge — no negative margins needed if the parent's own `min-w-0` lets the scroll container take full width.
- `snap-x` + `snap-start` on each tile gives thumb-friendly stops.
- Use `truncate` (+ `w-full` on the label) for single-line ellipsis; multi-line labels make tiles feel oversized and defeat the "button pad" read.
- Pair with a scroll-chevron affordance only when the overflow is non-obvious (narrow tab rows, where the faded edge alone doesn't cue). See `ContentTabs.vue` for the `ResizeObserver`-driven chevron + `mask-image` fade combination.
- **Mobile/desktop twin gotcha.** When a button carries a `data-test` id and renders both in a mobile tile row AND a desktop sidebar (e.g. `MobileActionTiles` + `SidebarActionList` fed from the same `actions[]`), the same id appears twice in the DOM. Playwright's `.first()` picks DOM order, not visibility — so a test that resolves to the `display:none` twin reports "hidden". Fix on the test side with `:visible` filter (e.g. `[data-test="foo"]:visible`), same pattern already used for `messaging-drawer`'s mobile/desktop twin.

### Mobile Input Requirements

**Prevent zoom on input focus (iOS):**
```vue
<input
  type="text"
  style="font-size: 16px"  <!-- Minimum 16px prevents iOS zoom -->
  class="px-4 py-3"
/>
```

**Touch targets:** Minimum 44x44px for all interactive elements

## Forbidden / red flags

Hard nos, in addition to the [Forbidden by default](#forbidden-by-default) Tailwind list above:

- Decorative elements with no information — every pixel earns its place.
- `bg-primary-*` for containers; primary is for interactive only (CTAs, links, focus).
- Colored banner backgrounds — color in the icon, not the surface.
- Tinted icon tiles on `bg-theme-25` — solid colored glyphs instead.
- Warning colors (amber / orange / red) used as decoration. Earned, not free: real status only — overage, past-due, destructive. A duplicate "needs attention" mark next to a title that already says "No Plan" drains the color's meaning elsewhere. Cheap-template smell.
- Multiple font weights stacking instead of size-driven hierarchy.

## Audit before ship

Run the four audits above on every surface before merge or release:

1. [Action Feedback Contract](#action-feedback-contract) — every user-triggered action.
2. [Composition Audit](#composition-audit) — squint test, F/Z path, grid, proximity, line length, red route, Hick's & Fitts's.
3. [Language & Mental Model](#language--mental-model-audit) — stranger test, anthropomorphize the assistant.
4. [Animation Audit](#animation-audit) — purpose test, timing tier, reduced motion.

A surface failing 2+ checks in any audit is unfinished, regardless of fidelity.

## Related Specs

- `standards/core.md` → first principles, decision heuristics
- `standards/code-style.md` → Tailwind conventions, Vue patterns
- `standards/writing.md` → user-facing copy patterns
- `standards/refactoring.md` → applying these audits during refactor rounds
- `features/dashboard.md` → dashboard-specific layout
- `features/forms.md` → form styling
