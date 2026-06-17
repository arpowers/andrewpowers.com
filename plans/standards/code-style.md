# Code Style Standards

TypeScript, Vue, and Tailwind conventions for PageLines App.

## Quick Reference

| Aspect | Convention |
|--------|------------|
| **Args** | Use args objects for project-owned functions, even one-field calls |
| **Classes** | Extend `SettingsObject<T>`, access config via `this.settings`, getters only for derived values |
| **Types** | Domain configs stay flexible; public wire schemas stay exact |
| **Imports** | Shared types from `@pagelines/core`, module-specific stay local |
| **Vue Props** | Destructuring with defaults, no `withDefaults()` |
| **Tailwind** | Full class names, semantic colors (`primary-*`, `theme-*`) |
| **Dates** | ISO strings with `dayjs()`, never `Date` objects |
| **Null** | Return `undefined` for "not found"; `null` only for explicit unsetting |
| **Tests** | Suffix with kind: `*.unit.test.ts`, `*.flow.test.ts`, `*.uiux.test.ts`, `*.e2e.test.ts` |
| **Branching** | Engine arrays over `if/else`/`switch` chains when behavior varies by key |
| **Definitions** | Human-readable config lives in typed definition/registry files; mechanics live in controllers/core |
| **Comments** | Explain why, constraints, and surprises; never restate the next line |
| **Simplicity** | Locality > DRY. No shadow state, no alias names, no `as any` on own types |
| **HTTP calls** | One method per endpoint on the owning client, DI'd. No `fetch()` / `openApiFetch()` in components or sibling modules |

## Function Arguments Pattern

Project-owned functions take one args object, even when the function needs only one value today. Named arguments make call sites readable and let a function grow without changing every caller.

```typescript
// ✅ DO - Args object pattern
async function createUser(args: {
  email: string
  handle: string
  fullName?: string
  orgId?: string
}) {
  const { email, handle, fullName, orgId } = args
}

// ✅ DO - One-field args object
async function getUserById(args: { userId: string }) { ... }

// ❌ DON'T - Single positional argument
async function getUserById(userId: string) { ... }

// ❌ DON'T - Multiple positional arguments
async function createUser(email: string, handle: string, fullName?: string) { ... }
```

This rule extends to private methods, single-field helpers, composables, and tests. The narrow exceptions are externally imposed signatures: framework callbacks, array callbacks, Hono handlers, Vue event handlers, and third-party APIs where we do not own the call shape. Keep those at the boundary; project-owned helpers called from the boundary still use args objects.

**Inline the args type — don't extract a named `interface FooArgs`.** The args bag is part of the function's signature; pulling it into a sibling `export interface FooArgs { ... }` adds a name, an export, and a second source of truth that drifts from the function it describes. Reader scrolls up to learn what the named arg means; maintainer has to keep two places in sync. Inline the shape on the parameter directly — that *is* the type:

```typescript
// ❌ DON'T — single-use named interface for one function
export interface MintCodeArgs {
  email: string
  ip: string
  ttlSeconds?: number
}
export async function mintCode(args: MintCodeArgs): Promise<string> { ... }

// ✅ DO — inline the shape
export async function mintCode(args: {
  email: string
  ip: string
  ttlSeconds?: number
}): Promise<string> { ... }
```

Extract a named interface only when **3+ call sites** reference it OR the shape is reused across module boundaries (e.g. a wire-contract Zod schema). The same principle scopes [Endpoint consumption](#endpoint-consumption--one-method-per-endpoint-on-the-owning-client) below: consolidate when consolidation *removes* entropy, inline when extraction *adds* it.

## Comments

Comments earn their place only when they preserve context the code cannot show by itself.

Keep comments for:
- **Why:** a non-obvious decision, tradeoff, or product rule.
- **Constraints:** external API quirks, ordering requirements, security boundaries, migration windows.
- **Surprises:** behavior a reader would reasonably try to "simplify" and break.

Delete comments that restate code:

```typescript
// ❌ Restates the branch
// Owner always has access
if (agent.ownerId === userId)
  return { hasAccess: true }

// ✅ Names the hidden constraint
// Hono prefix-matches route middleware; keep this check inline so
// `/agents/state` cannot bind as an agent id.
const access = await authUtility.checkAgentAccess({ userId, agentId })
```

When a comment is needed, put it next to the constraint it protects. Prefer a better name or a small extracted function over a paragraph.

## Branching

Pick the shape that matches how the cases actually vary. Cost goes up at each step — don't escalate without a reason.

| Cases | Shape | Use when |
|---|---|---|
| 1-2 | `if` / early returns | Guard clauses, ordered policy checks, two paths small enough to read in place. |
| 3+ on a discriminated value | `switch` with exhaustiveness check | Closed union or string-literal enum. TypeScript warns on missing cases. |
| 3+ with handlers sharing one shape | Engine array | Each case carries structured data (config + handler fn). New cases are additive — one row. |

```typescript
// ✅ Ordered policy ladder — order is the rule.
if (!agent)
  return { hasAccess: false }
if (agent.ownerId === userId)
  return { hasAccess: true, agent }
if (requireOwnership)
  return { hasAccess: false, agent }

// ✅ Closed discriminator — exhaustiveness is the rule.
switch (event.kind) {
  case 'message':
    return encodeMessage(event)
  case 'status':
    return encodeStatus(event)
  default:
    return assertNever(event)
}
```

Don't replace a short guard ladder with `switch` to look structured. Don't build an engine array until the repeated control flow is real, not guessed.

## Type Standards

### Single Source of Truth: `@pagelines/core`

Published npm package containing all shared types and Zod schemas. Used across app, SDK, and widget.

**Add to `@pagelines/core`** when used by 3+ modules or across app/SDK/widget. **Keep in modules** when single-use or internal.

### Single Entity Type Pattern

For internal domain/config objects, prefer one flexible entity type over separate `CreateX` / `UpdateX` variants. Keep optionality where the caller genuinely sends partial data.

```typescript
// ✅ Internal Agent config type for partial operations
interface Agent {
  agentId?: string
  name?: string
  handle?: string
}

// ❌ Internal type proliferation when the shape differs only by optionality
```

Do not apply this rule to public wire contracts. Route bodies, SSE frames, and SDK schemas should be exact per surface: required fields stay required, removed fields disappear, and consumers fail fast when the contract changes. Flexible internal config types reduce churn; flexible wire schemas hide drift.

### SettingsObject Base Class

All classes that hold configuration extend `SettingsObject<T>` (from `src/utils/base.ts`). Provides `this.settings` for config access and `this.logger` for contextual logging. Access fields via `this.settings.name`; only create getters for derived values, not field-by-field passthroughs.

### View Model Pattern (Ref-Based)

When an entity has 3+ computed display properties duplicated across components, create a view model class. Every config field becomes a `ref()`, every derived property becomes a `computed()`.

**Naming:** `Entity` = view model class, `EntityConfig` = plain JSON data.

**Reference implementation:** `packages/core/src/agent.ts`

**Key rules:**
- All fields are `ref()`, all derived are `computed()` — consistent `.value` access
- DI via constructor settings (e.g. `agentClient`), not imports
- `toConfig()` reads `.value` from every ref to produce plain JSON
- `shallowRef<Entity>()` not `ref<Entity>()` for class instances
- `readonly` not `private` — TypeScript `private` breaks vue-tsc slot inference
- `update()` returns new instance for shallowRef compatibility
- Never spread class instances — use `agent.update({})` or `agent.toConfig()`
- Server-side uses Config types only (plain objects cross API boundaries)

### Type Design Guidelines

- All optional by default — `?` for most properties
- Single schema per entity — one for create/update/read
- Dates as ISO strings — `z.string()` with `dayjs()`
- Never use `@ts-nocheck`, `@ts-ignore`, or `any`
- Type casting: acceptable for bridging compatible types, never for bypassing safety

### Null vs Undefined

`null` means "unset this" — use it only when a boundary distinguishes absent from cleared. Everything else is `undefined`.

- **Default `undefined`** for state, return values, optional fields — JS does this for free; aligning removes surprise.
- **Reach for `null`** only at wire / DB / third-party boundaries that distinguish absent from cleared (`PATCH { x: null }` to clear, Drizzle nullable columns, external APIs that already speak null). Mirror the boundary; don't translate at every read.
- **One check: `=== undefined`.** If `== null` (loose, covers both) feels needed, the field has conflated two concepts — split it.

## Vue Patterns

### Core Principles

- Components = pure functions of props + state
- No side effects in computed(), setup(), or render
- All dependencies via props or dependency injection

### Props

```typescript
// ✅ Destructuring with defaults
const { agentId = "default", title = "Assistant" } = defineProps<{
  agentId?: string
  title?: string
}>()

// ❌ Never use withDefaults()
```

### Explicit State Flow

- **Entry components load, children receive.** Children never reach into global singletons — that hides where state comes from.
- **Exception: true app-wide singletons.** `userClient.activeUser.value` is fine — every component needs the same user. If scoped to a page/feature, pass as prop.
- **Props don't duplicate what another prop already knows.** Pass `agent`, not `agent` + `statusDotClass`.
- **Pass the rich object, not its serialized form.** Don't call `.toConfig()` before passing to a child.

### Computed and Handlers

```typescript
// ✅ Pure computed
const userDisplay = computed(() => formatUser({ user: props.user }))

// ❌ Computed with side effects
const bad = computed(() => { sharedState.value++; return props.data.length })

// ✅ Pure handlers with injection
const handleSubmit = async (data: FormData) => {
  const result = await injected.userService.create({ data })
  emit('created', result)
}

// ❌ Hidden side effects — use injected services
const bad = () => { window.localStorage.setItem('key', value) }
```

### Hydration Strategy

Use `client:only="vue"` for all user-dependent components. Any component using `useService()`, role-based rendering, or dashboard context = `client:only`.

## TailwindCSS Standards

Always use semantic color names, never raw colors. Full class names only — never dynamic Tailwind strings.

```css
/* ✅ Semantic colors */
bg-primary-500     /* interactive elements (buttons, links) */
text-theme-700     /* body text */
border-theme-300   /* neutral border */

/* ❌ Raw colors */
bg-blue-500
text-gray-500
```

Tailwind v4+ — all config in CSS file (no `tailwind.config.ts`).

## File Placement

**One consumer → colocate. 2+ consumers → promote to shared.**

Don't put single-use files in grab-bag directories (`scripts/`, `public/`). Put them next to their consumer. Shared locations (`src/utils/`, `public/`) are earned by having multiple consumers, not used as defaults.

In `src/pages/`, prefix non-page files with `_` so Astro doesn't treat them as routes.

## Module Organization

Every non-trivial module follows the same shape. The structure is **discoverable from `ls`** without needing to read code, and **a file's location communicates its role**.

### Standard layout

```
modules/<name>/
├── server.ts            # The controller / main class — orchestration only
├── types.ts             # Shared types for this module
├── index.ts             # Barrel — public exports
├── <concept>.ts         # Domain primitives (pure: e.g. context.ts, schema.ts)
├── test/                # Tests for files at this level (server, types, context)
│   ├── server.test.ts
│   └── context.test.ts
│
├── routes/              # HTTP handlers — one file per logical group
│   ├── index.ts         # Barrel — exports registerXRoutes(app, deps)
│   ├── credentials.ts   # NO prefix — folder makes it redundant
│   ├── memory.ts
│   ├── workspace.ts
│   └── test/            # Colocated — tests live next to the code they test
│       ├── credentials.test.ts
│       └── memory.test.ts
│
├── utils/               # Pure functions only — no I/O, no DI, no state
│   ├── index.ts         # Barrel
│   ├── query.ts         # NOT utils-query.ts — folder communicates "utility"
│   ├── format.ts
│   └── test/
│       ├── query.test.ts
│       └── format.test.ts
│
├── prompts/             # Markdown templates for LLM-facing content (optional)
│   ├── README.md        # Editing guide + placeholder reference
│   ├── pl-context.md    # {{placeholder}} interpolated by utils/template.ts
│   └── bootstrap.md
│
├── services/            # Stateful collaborators (optional — only if 3+ exist)
│   ├── index.ts
│   ├── ai-proxy.ts
│   └── test/
│       └── ai-proxy.test.ts
│
└── __deprecated/        # Legacy / WIP code awaiting deletion (optional)
    └── README.md        # Why it's here, when it goes
```

**Test colocation rule**: every folder that contains source files gets its own `test/` subfolder for tests of THOSE files. Don't mirror the whole module tree under one top-level `test/` — that forces readers to jump between two parallel hierarchies. Walking into `routes/` should show both the handlers and their tests one level down.

### Naming rules

| Rule | Why |
|---|---|
| **No `utils-` / `route-` prefixes when in the matching folder** | Folder communicates the role; prefix repeats it. `utils/query.ts` not `utils/utils-query.ts`. |
| **Controllers + module-root concepts have no prefix** | `server.ts`, `context.ts`, `types.ts` at root. Their position IS their classification. |
| **Files in `routes/` register routes** | Each exports `registerXRoutes(app, deps)`. The barrel re-exports them; `server.ts` calls `registerAll(app, deps)`. |
| **Files in `utils/` are pure** | No `EnvServer`, no `fetch()`, no `db()`, no module-level state. If it needs DI or I/O, it belongs in `services/` or at module root. |

### What goes where

| Concern | Location |
|---|---|
| Class with state, DI, lifecycle | Module root (`server.ts`, or named `xyz.ts` if it isn't the main one) |
| HTTP handler | `routes/<domain>.ts` |
| Pure helper, formatter, computation | `utils/<concept>.ts` |
| Markdown / LLM prompt content | `prompts/<name>.md`, loaded + interpolated by `utils/template.ts` |
| Stateful collaborator with constructor DI | Module root (1-2 files) or `services/` (3+ files) |
| Domain types | `types.ts` at module root |
| Constants | `constants.ts` at module root, or inline if module-private |
| Legacy code awaiting deletion | `__deprecated/<name>.ts` — never imported from production code |

### Where the complication lives

Push logic out of controllers into pure `utils/` functions. Controllers (server.ts, route handlers) read: parse input → call utils → shape response. This buys controller scannability + cheap test coverage on utils (no DB fixtures, no request mocking). If a util is hard to test, its signature is wrong.

### Definitions and registries

Human-readable behavior config belongs in typed declaration files, not inside runner/control-flow code. The reader reviewing what exists does not have to parse how it runs.

Use this shape for lanes, scenarios, service definitions, provider capability tables, prompt template inventories, state-machine rows, and report gate routes:

- `definitions/<domain>.ts` or `registry.ts` owns the data.
- A pure selector turns registry + flags into a plan.
- A shell class executes the plan through injected collaborators.

This keeps reviewable policy separate from mechanics without losing TypeScript checks. YAML/Markdown can be generated for humans, but the typed registry stays the source of truth unless a non-TS consumer owns the data.

Anti-patterns:

- Behavior prose buried in a runner method.
- Two registries describing the same cases for local and CI paths.
- YAML source plus TypeScript parser plus validation layer when only engineers author the scenarios.

### Function vs "functional class"

Pick by state, not size:

| Shared state across calls? | Use |
|---|---|
| No | Plain functions in a `utils/*.ts` file — the file IS the namespace |
| Yes (cache, lock, pool) or methods share 3+ heavy deps | "Functional class" — group of functions, deps in constructor, no inheritance |

`class FooUtils` with all-static methods is a namespace pretending to be a class. Use a file.

### Pure function discipline

- **No hidden inputs.** No `Date.now()`, `process.env`, `fetch()`, module-level state. Take `now` / `clock` / env value as args.
- **Args in, return out.** No mutating args, no emitting events. Return what the caller needs to know.
- **Throw only for invariant violations.** Expected "not found" / "not configured" returns `undefined`. Forcing every caller into try/catch for expected cases is poor policy.
- **`logger` is the one permitted side channel** — take it as optional (`opts.logger?.warn(...)`), never import it.

### Throw, don't Result-type

We throw; we don't `Result<T, E>`. Hono's `onError` catches at the boundary. Don't introduce Result-typed utils thinking you're helping — you're adding a second error vocabulary.

### Async honesty — never `void` a promise

A function that does async work returns `Promise<T>`. Don't `void` the call to hide the await — the dropped promise drops its rejection with it. `void promise` is the client-side equivalent of `try { ... } catch {}` on the server: a swallowed failure the type system can't help you find. **Fail-fast in disguise.**

Acceptable shapes:

```ts
await promise              // I own the lifetime
return promise             // I hand the lifetime to my caller
```

If the caller is a sync boundary (event handler, watcher, lifecycle hook) and the promise has nowhere honest to go, make the callback `async` and wrap the body in **one** `try/catch` around the whole logical block. Don't `.catch()` each call — per-call `.catch()`s read like exception-handling cargo-cult and obscure which lines are part of the same operation; one try/catch lets you await the whole sequence and land all failures in one named place.

The narrow exception: a single fire-and-forget at a sync boundary that genuinely *can't* become async (e.g. a sync method called from many other sync paths). There, `.catch(handler)` is the right shape — it's still explicit, still lands the rejection, and conveys "this is the one async edge of an otherwise sync function." Don't reach for it when you have multiple awaits in a row — that's where the try/catch boundary belongs.

The signature is the contract. A handler returning `void` claims "no async failure to wait on." A handler returning `Promise<void>` says "await me." Don't lie about which one — the next caller will trust the type.

This is **functional core, imperative shell** (Bernhardt): effects belong at the edges, pure logic in the middle. A `void promise` in the middle of pure-looking code is a leak — it claims to be effect-free but spawns an untracked background promise. Vue components are the imperative shell; they're the right place to land async errors with try/catch, not the wrong place for `void`.

**Logging caught errors.** Pass the caught value straight to the logger — the logger handles `Error` unwrapping. Don't pre-unwrap to `err.message` — that duplicates work and throws away the stack trace. The description should name the operation that failed, not the surface — the logger already prepends component context.

### Exception: gate/verdict functions return ApiResponse shape

Functions whose *purpose* is producing a verdict — `check*`, `validate*`, `canX`, preflight checks — return the same shape endpoints return:

```ts
async checkRateLimit(agentId: string): Promise<ApiResponse<void>>
// { ok: true } or { ok: false, error: '...', code: 'RATE_LIMITED' }
```

Caller propagates the verdict straight through: `if (!result.ok) return c.json(result, 429)`. No re-wrapping, no hardcoded error strings at the call site, stable `code` field flows from gate → response → client switch.

Distinguish from producer functions (`get*`, `build*`, `detect*`) — those return the value or undefined; throw for invariant violations. The rule: **if the function's job is to decide "allowed / not allowed," it's a gate** and should return the verdict shape. Boolean returns lose the reason; string-or-null returns lose the discriminator.

Legitimate `boolean` returns: true binary state probes with no "reason" to carry (`isLoggedIn`, `checkBotReady` health probe).

### Function naming signals I/O

| Prefix | I/O? | Examples |
|---|---|---|
| `build*` / `resolve*` / `extract*` / `detect*` / `derive*` / `format*` | Pure | `buildContext`, `detectPlan`, `extractPeriodDates` |
| `get*` | Maybe | `getAgentWithJoins`, `getPlatformTemplates` |
| `load*` / `fetch*` / `list*` / `query*` / `upsert*` / `persist*` / `sync*` | Yes | `loadOrCreateThread`, `persistChatMessage`, `syncFleet` |

Rename if the prefix lies.

### Naming conventions — fields, IDs, booleans, endpoints

Stable suffix patterns let a reader infer type and intent from a name alone. Keeps the codebase coherent without a domain-noun glossary that would go stale.

| Shape | Pattern | Examples |
|---|---|---|
| **Timestamps** | `*At` — ISO string with `dayjs()`, never `Date` objects (per Quick Reference above) | `createdAt`, `lastActiveAt`, `lastMessageAt`, `expiresAt`, `onboardedAt` |
| **Identifiers** | `*Id` (singular), `*Ids` (collection) | `agentId`, `userId`, `orgId`, `messageIds` |
| **Booleans** | `is*` (state), `has*` (existence), `can*` (capability), `should*` (recommendation) | `isLoaded`, `isEnabled`, `isEmailVerified`, `hasInstance`, `canCreateAgent`, `shouldRetry` |
| **Counts** | `*Count` (integer count of something) | `messageCount`, `outgoingToolCount`, `usedCredits` |
| **Durations** | `*Ms` / `*Sec` (numeric, unit explicit) | `durationMs`, `bootMs`, `expiresInSec` |

**Things to avoid:** `flag` / `data` / `info` (carry no meaning), `*Date` for system-event timestamps (use `*At`; reserve `*Date` for business calendar dates without a time component), boolean fields without `is/has/can` prefix (`enabled` reads ambiguous; `isEnabled` is clearer), vague timestamps (`lastActivityAt` and `lastMessageAt` are functionally different — name what each tracks).

### Database & schema standards — Drizzle on Postgres

Drizzle holds both names per column. TS = camelCase (JS standard); PG = snake_case (SQL standard, unquoted identifiers fold to lowercase).

```ts
lastActiveAt: text('last_active_at')   // camelCase property → snake_case column
```

| Shape | TS suffix | PG suffix | Type |
|---|---|---|---|
| Primary key | `<entity>Id` | `<entity>_id` | `varchar(32)` — prefixed nanoid (`usr_…`, `agt_…`); underscore separator + lowercase payload for readable, portable IDs |
| Foreign key | `<entity>Id` | `<entity>_id` | Same column as target PK; `references(...)` with explicit `onDelete` |
| Timestamp | `*At` | `*_at` | `text` ISO string (not `timestamptz` — see deviations) |
| Calendar date (business) | `*Date` | `*_date` | `text` ISO date (`YYYY-MM-DD`) — real-world calendar dates only (`birthDate`, `subscriptionPeriodStartDate`); not system events |
| Boolean | `is*` / `has*` / `can*` / `should*` | `is_*` / `has_*` / … | `boolean` — never bare `enabled` / `verified` / `active` |
| Count | `*Count` | `*_count` | `integer` |
| Duration | `*Ms` / `*Sec` | `*_ms` / `*_sec` | `integer` or `real` |

**Tables**: plural snake_case (`agents`, `users`, `conversation_participants`). **Indexes**: `<table>_<cols>_idx`. **Status columns**: keep the name `status`; document the per-entity vocabulary in the inline comment.

**Cross-environment isolation is physical**: separate `POSTGRES_URL` per env. Never add a `deploy_env` column to filter rows — the dev DB only has dev rows, prod only has prod. Bot callbacks (`BOT_API_URL`) inherit the provisioning server's env at create time.

**JSONB**: allowed only for fields you never query inside (Apollo blob, notification prefs, request metadata). The first `WHERE jsonb_field @> ...` is the signal to denormalize.

**Deliberate deviations from the PG default**:

| Default | We do | Why |
|---|---|---|
| `timestamptz` | `text` ISO string | `dayjs()` everywhere; crosses JSON wire naturally; zero timezone confusion |
| UUID / serial PK | Prefixed nanoid | Readable in logs (`usr_abc…` beats `1f2e8…`) |
| Migration files | `pnpm db:push` | Green-field velocity; revisit when schema-evolution-without-downtime becomes load-bearing |

### Endpoint shapes — plural collections, CRUD that handles one or many

Routes follow REST plural conventions; the handler's CRUD shape is built to handle one OR many to consolidate code paths:

| Pattern | Example | Why |
|---|---|---|
| **Plural collection** | `GET /agents`, `GET /messages` | Consistent shape; client never has to know if "the result is a list or a single thing" |
| **Resource by id** | `GET /agents/:agentId` | One canonical path per resource |
| **Batch-friendly mutations** | `POST /agents` (accepts one `{...}` OR `[{...}]`) | One impl, one validation pass, one set of tests covers single + batch |
| **Read returns array even for single** | `getAgentsByUserId({ userId }) → Agent[]` | Caller branches on `.length`, not on null vs object — fewer call-site types |

Wire envelope is always `ApiResponse<T>` (see [`api.md`](../architecture/api.md)). Error codes are `SCREAMING_SNAKE_CASE` in the `code` field.

### Endpoint consumption — one method per endpoint, on the owning client

Every URL the app issues a request to — our own `/api/*`, Fly, Stripe, OpenAI, Discord, Slack, Telegram, Apollo, the bot VM relay — lives in exactly one method, on exactly one DI'd client. Components, sibling modules, and tests call that method. They do not call `fetch()` / `openApiFetch()` directly.

**Why.** URLs are stringly-typed; the type-checker can't catch a stale path or a method/body mismatch. A second call site for the same endpoint is silent duplication: when the path moves, the auth changes, the response shape evolves, or a retry policy lands, every duplicate is a place the rule didn't apply. Concentrating each endpoint at one call site makes those changes one-line.

**Rule.**

- `/api/agents/...` → `AgentClient` method. `/api/users/...` → `UserClient`. `/api/orgs/...` → `UserClient` (orgs surface). External providers → the module that owns the provider (`AIProxy`, `Provisioner`, `tracking.NotificationsService`, channel `definition.ts`).
- Vue components consume client methods via `useService()`. Never `import { openApiFetch }` inside a component.
- One outbound URL string per host+path in production code. If two sites encode `https://api.openai.com/v1/audio/transcriptions`, one of them is wrong — pull the path to a constant or, better, one method on the owning service.
- Dev playgrounds (`src/pages/playground/*`) are exempt — they exist to poke endpoints from the outside. Mark them as dev-only and don't import them from production code.

**Scope — when *not* to consolidate.** The rule is about *our* `/api/*` endpoints and *concentrated* provider surfaces (multiple methods, shared auth/retry/error mapping — `AIProxy`, `Provisioner`). It is **not** "extract every URL into a helper." Don't pull a 3rd-party URL into a shared util when:

- The callers don't share credentials (different tokens / accounts / scopes).
- The callers don't share retry, error mapping, or response parsing.
- Only **two** call sites exist and each is a single line.
- The helper would just rename a template literal (`return \`https://...${arg}/${method}\`` is not abstraction).

Threshold to extract: **≥3 callers** AND shared behavior beyond the URL string (auth, retry, parsing). Otherwise the inlined URL is the lower-entropy choice — one fewer file, one fewer import, one fewer interface. Caught 2026-05-26 when this rule was misapplied to Telegram (`tracking/` + `services/pl-channel-telegram/` — two callers, different tokens, one-line each) and a `utils/telegram-api.ts` helper was extracted that did nothing but rename a template literal.

**Anti-pattern.**

```ts
// ❌ Component calls the endpoint directly. Same path now lives at agent/client.ts:231 too.
// AgentCreateModal.vue
const result = await openApiFetch<ApiResponse<AgentConfig>>('/api/agents', { method: 'POST', body })
```

```ts
// ✅ Component asks the client.
// AgentCreateModal.vue
const result = await agentClient.createAgent({ ... })
```

### Late-bound DI for genuine cycles

When two modules genuinely depend on each other (e.g. `agent` needs `billing` for quota checks; `billing` needs `agent` for tracking), don't inject the eager instance — inject a **getter**:

```ts
// settings shape on the dependent class
interface MutationsSettings {
  getBillingServer: () => BillingServer | undefined  // late-bound
}

// constructor stores the getter, not the value
this.getBillingServer = settings.getBillingServer

// call site dereferences at use time
const billing = this.getBillingServer()
if (billing) await billing.canCreateAgent(...)
```

The getter is set once at composition time (in `main/server.ts`) before either module receives traffic. Reserve this for actual cycles — use direct DI everywhere else.

### DI + no module-level mutable state

- **Default factories go in the constructor**, not module-level singletons: `this.foo = settings.foo ?? new Foo({ env })`. Tests inject doubles via `settings.foo`.
- **Module-level mutable state is forbidden** (no `let counter = 0` at top of file). Caches live on a class instance. Exception: frozen tables like `const ROLES = { ... } as const`.

### TDD discipline for refactors

When restructuring an existing module:
1. **Lock current behavior with a test** before moving any code. If a handler isn't covered, write a test against the current implementation first.
2. **Move file with imports updated** — pure mechanical, run typecheck.
3. **Run targeted tests** — they should still pass.
4. **Refactor internals** only after step 3 is green. The test acts as the safety net.

A refactor commit that introduces both structural changes AND behavior changes is a refactor commit that hides bugs in the diff. Keep them separate.

### Anti-patterns

- ❌ `utils-query.ts` next to `routes/` — pick a folder, drop the prefix.
- ❌ Routes that import from each other — they should only import from `services/`, `utils/`, and `types.ts`.
- ❌ A `services/` folder with one file — promote to module root until there are 3+.
- ❌ A `helpers/` or `misc/` folder — name by *what they do*, not by *what they're not*.
- ❌ Re-exporting everything from `index.ts` — only public API. Internal helpers stay private to the module.

## Test Naming

Suffix every test file with its **kind** so CI tiers and readers can tell expensive from cheap at a glance:

| Pattern | What it covers | Speed |
|---|---|---|
| `*.unit.test.ts` | Pure functions, no DB / no network. `vitest run` in milliseconds. | Fast |
| `*.flow.test.ts` | Multi-step business logic that touches a real DB or service via `createTestService`. | Medium |
| `*.uiux.test.ts` | Vue component / DOM interactions via `@vue/test-utils` or Playwright component tests. | Medium |
| `*.e2e.test.ts` | Full-stack browser tests — Playwright spec files. | Slow |

Existing bare `*.test.ts` files migrate as they're touched — don't churn the whole tree at once.

### Async test synchronization — wait on what you assert

An async test must synchronize on the **exact** signal it asserts, never a correlated proxy. Waiting on a different-but-related signal — polling a DB write while you assert on pubsub events, sleeping a fixed `setTimeout` while you assert on a count — races: the two async paths drift apart under CI's contended scheduling, so the test passes locally and flakes in CI.

- **Poll the asserted value**, bounded by a deadline: `await waitFor(() => events.length === 3)` *then* assert `events` — not `waitFor(() => rowsPersisted())` then assert the events.
- **No fixed `setTimeout(n)` before a positive assertion** — a delay tuned to a fast local machine misses under load. Fixed waits are defensible only for *absence* assertions ("confirm X did not happen"), and even then prefer driving the system to a terminal state and asserting that.
- **CI-vs-local divergence is the tell.** Passes locally, flakes on a shared 2-core runner = a scheduling race, not infra. Don't bump the timeout — fix the synchronization.

### No monkey patching by default

Do not monkey patch imported modules, globals, runtime internals, or third-party objects to make application code or tests work. Monkey patching couples the test to load order and private implementation shape; upgrades then break the patch instead of the product behavior.

Use dependency injection, constructor settings, args-object collaborators, pure helpers, or boundary fakes passed through the owning class. If an unmodifiable third-party boundary truly leaves no alternative, get explicit confirmation, isolate the patch in one test, and name why DI was impossible. Existing monkey-patched tests migrate as they're touched.

## Patterns

### Fallback chains: extract or `??`, don't ladder

A series of `if (x) return y` lines computing **one logical value** across multiple sources is a fallback chain. Three or more in a row scanning for "first truthy wins" reads as noise — the reader has to parse each predicate to learn the priority.

When the predicates are simple truthy checks, collapse with `??`:

```typescript
return polled ?? embedded ?? heuristic ?? 'unknown'
```

When the predicates carry meaning that `??` can't express, extract a pure helper. The helper's name documents the priority; its signature labels each input; one test covers the precedence:

```typescript
const status = computed(() => resolveStatus({ polled, embedded, hasInstance, desired }))
```

**Trigger:** 3+ consecutive `if (...) return` lines with the same return type. **Why:** named extraction or `??` makes priority explicit; an inline ladder buries it in line order.

### Engine arrays over branching logic

When behavior varies by a key/type/role and **each case has the same handler shape**, prefer a data table you iterate over. Beats both `switch` and `if/else` for additivity, testability, and grep-ability.

```typescript
// ✅ DO — data describes the behavior
const webhookHandlers = [
  { type: 'invoice.paid', handle: handleInvoicePaid },
  { type: 'customer.subscription.updated', handle: handleSubUpdated },
  { type: 'checkout.session.completed', handle: handleCheckoutCompleted },
] as const

const entry = webhookHandlers.find((h) => h.type === event.type)
await entry?.handle(event)
```

```typescript
// ❌ DON'T — every new case is a structural edit
switch (event.type) {
  case 'invoice.paid': { /* 30 lines */ break }
  case 'customer.subscription.updated': { /* 25 lines */ break }
  // ...
}
```

Use this for: webhook dispatch, runtime/provider resolvers, error classifiers, plan/quota tables, channel-type registries.

Skip it when: there are only 2 cases, or the cases share so much state that pulling them apart costs more than the duplication saves.

### Engine arrays for *rendering* — N-of-same from one config + one loop

The sibling pattern: when two or more rendered elements share structure — rows in a list, items in a nav menu, fields in a form, buttons in a toolbar — render them from one config array via a single loop. Two adjacent components in the same template that differ only by content is a candidate refactor.

Duplicated markup is the primary source of design drift. Adding a font weight to one row, missing the sibling, and the visuals fork silently — the dissonance only appears later. One loop has one definition of "what a row looks like" and one definition of "what the rows are."

```vue
<!-- ✅ Vue: one v-for over a config -->
<script setup>
const navItems = [
  { key: 'profile',  label: 'Profile',  icon: 'i-tabler-user',   to: '/profile' },
  { key: 'billing',  label: 'Billing',  icon: 'i-tabler-card',   to: '/billing' },
  { key: 'team',     label: 'Team',     icon: 'i-tabler-users',  to: '/team' },
  { key: 'settings', label: 'Settings', icon: 'i-tabler-gear',   to: '/settings' },
]
</script>
<template>
  <NavRow v-for="item in navItems" :key="item.key" v-bind="item" />
</template>
```

```vue
<!-- ❌ Four NavRow declarations side by side. Adding a fifth means
     editing here AND the mobile drawer AND the iPad sidebar. -->
<template>
  <NavRow label="Profile"  icon="i-tabler-user"   to="/profile" />
  <NavRow label="Billing"  icon="i-tabler-card"   to="/billing" />
  <NavRow label="Team"     icon="i-tabler-users"  to="/team" />
  <NavRow label="Settings" icon="i-tabler-gear"   to="/settings" />
</template>
```

Same principle applies on iOS via `ForEach` over a `CaseIterable` enum. The exhaustive switch inside the enum (`var title: String { switch self { ... } }`) forces every case to define its fields — adding a case without a title is a compile error. Drift is structurally impossible. See [`products/ios-messenger/standards/swift-code-style.md` § Engine Arrays](../products/ios-messenger/standards/swift-code-style.md#engine-arrays) for the Swift concretization.

Use this for: navigation items, settings rows, form fields, tab bars, table columns, toolbar buttons, any repeated structure.

Skip it when: there are only 2 elements AND they're guaranteed to stay that way (rare — most "just two" surfaces grow to three within a quarter).

### DRY doesn't mean abstract

Only extract shared logic when extraction *reduces* total code AND makes the next change easier. Two similar functions that read top-to-bottom are easier to maintain than one parameterized function that needs three flags to cover both call sites.

The check: write the abstraction, then count lines including the new helper, the call sites, and the test. If the total grew, delete the abstraction.

### Cognitive load — keep reasoning local

Splitting is not free. Every extracted file is one more jump for a reader trying to understand a single behavior.

**Split when:** a file mixes unrelated concerns, a single function is hard to hold in your head, or extraction unlocks meaningful test isolation.

**Don't split when:** the extracted piece has one caller, the new file is shorter than the imports that use it, or the abstraction is hypothetical ("we might need this elsewhere later").

## Simplicity Heuristics

Sharp rules for resisting accumulated complexity. **When DRY and locality conflict, locality wins.** These strengthen "DRY doesn't mean abstract" and "Cognitive load — keep reasoning local" above — the default is inline; extraction is earned.

### Default is inline. Extraction is earned.

Before extracting a helper, util, or abstraction, state in one sentence:

1. The **3+ current** call sites — not hypothetical future ones.
2. The behavior that's *genuinely* shared vs coincidentally similar.
3. What a reader loses in locality when they jump to the new file.

If (1) is <3 or (2) is weak, the duplication stays. Named duplication at three call sites beats one flag-parameterized helper that papers over two real cases. Count total lines including helper + call sites + tests — if the total grew, delete the abstraction.

### Locality beats DRY

Independent scopes keep inline copies. Extracting a "shared" helper that couples scopes which don't share a lifecycle forces readers to jump and makes the next per-site variation fight the abstraction.

Test: if two copies of a pattern can diverge independently without the other caring, they're right as copies.

### One concept, one public name

No alias refs pointing at the same value. No parallel enums describing the same domain. No synonym pairs differing only in tense or wording. Each is a rename-cycle left half-done.

Resolve in one commit: introduce new name → migrate callers → delete old. Both sticking around is technical debt with the interest compounding in every new caller that picks the "wrong" one.

### No shadow state

Client derives from server-emitted fields — never mirrors them into a client-only ref. Heuristic client copies of server intent, policy reasons, or any "what the server would say if we asked" duplicate a source of truth that will eventually disagree with it.

Client state is strictly UI-local: modal open, sessionStorage hints, focus, optimistic placeholders awaiting the next poll. Anything the server could know, ask the server.

### Immediate-click feedback for async actions

When a button triggers a server mutation whose authoritative state signal lags the click by hundreds of milliseconds, surface a local "pending" marker the moment the handler runs and clear it when the server-echoed state takes over. The marker is *not* shadow state — it represents "the user just asked for this," which is purely client-local.

Reach for this pattern when a control has visibly-late feedback; skip it for fast round-trips. Don't generalize it into an optimistic UI framework.

### Slot for title-adjacent content, not action-array filtering

When a shared component needs a "tertiary thing next to the title" (dismiss link, close X, badge, figure, counter), expose a named slot rather than filtering an `actions[]` array by a style flag to separate primary from tertiary.

Filtering leaks the caller's layout intent into the engine. A slot lets the caller drop whatever fits without teaching the shared type about new tertiary-style variants every time the design changes.

### No `as any` on your own types

`(obj as any).field` on a type your module owns is not a cast — it's a missing field. Add the field or delete the access. Load-bearing against the `@ts-ignore` ban: the cast slips past that rule.

### Override flags are a split signal

When a shared type grows optional override flags — `showX?`, `customY?`, `enabledZ?` — the "one shape with overrides" abstraction has leaked. Each flag is evidence the cases aren't uniform.

After a few overrides accrete on the same type, the choice is (a) extract the divergent case into its own type, or (b) stop calling the shape shared. Don't keep adding flags.

### Size as a trigger, not a rule

Service classes >500 lines or component files >300 lines trigger a split review, not automatic action. The PR must answer: "what single responsibility does this file hold?" If it takes a paragraph, the file is at least two files.

Grab-bag classes — reconciliation + admin queries + CRUD + side-effects all in one — are the common failure. The class name starts meaning many things. Split at concern boundaries, not at line counts.

### Deletion discipline for abstractions

The existing TDD rule ("lock behavior before moving code") is for *preserving* behavior. When *removing* an abstraction — alias refs, verb wrappers, dead enum values, client-only shadow state — delete its unit tests in the same commit.

Unit tests exist to lock contracts. Removing the contract means the test is load-bearing *against* the change. Keep only tests that assert the replacement behavior or the higher-level integration test that's always been the real guard.

A refactor that leaves behavior-cementing tests in place alongside abstraction-removal code silently documents both sides of the choice. Pick one.

### What's genuinely shared vs coincidentally similar

Two functions with the same shape may still not be the same function:

| Genuinely shared | Coincidentally similar |
|---|---|
| Will change together (fix in one = fix in both) | Happen to look alike today; may diverge tomorrow |
| Inputs/outputs have the same semantic meaning | Same types, different meanings (both take `string`, but one is email, one is handle) |
| Calling sites would all accept a renamed unified function | Call sites would argue about the name |

If you can't answer "would a bug in case A force a fix in case B?" with yes, they're coincidentally similar. Leave them.

### Wire-contract changes follow the contract checklist

Wire schemas have consumers (web SDK, iOS, third-party clients). Mid-PR drift between server and consumer is a prod-bug class we engineer against. The procedural workflow lives in [`architecture/api.md → Wire-change checklist`](../architecture/api.md#wire-change-checklist) — a wire change ships its consumer update in the same PR; the CI snapshot guard enforces it.

## Related Specs

- [`standards/first-principles.md`](first-principles.md) → Planning & implementation, single source of truth, observability as first-line feature
- [`standards/core.md`](core.md) → Engineering decision heuristics, fail-fast, multi-tenant scoping, env var conventions
- [`standards/refactoring.md`](refactoring.md) → Primary direction (transforms out, controllers thin), AI-coded entropy, tests in the refactor
- [`standards/design.md`](design.md) → Visual design, color system
- [`../architecture/dependency-injection.md`](../architecture/dependency-injection.md) → EnvServer patterns, state management heuristics
- [`../architecture/modules.md`](../architecture/modules.md) → Module organization, file structure, constants usage
