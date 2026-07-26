# BACKEND API REQUIREMENTS

**Project:** Tractive · **Version:** 7.1 · **Date:** 19 July 2026
**From:** Frontend Engineering · **To:** Backend Engineering
**Backend audited:** `https://tractive-be.vercel.app`

**Every item in this document was verified on 19 July with real authenticated sessions** — an admin account and a multi-role buyer/agent/transporter account — including **write tests** (fleets created and deleted, both admin status routes exercised, bids submitted). Nothing here is inferred from an unauthenticated probe.

**Closed since v6.2 — thank you:** `GET /api/reviews` + `/summary` now scope to the bearer token without `agentId` (was a blocker), and the fleet `capacity`/`size` question is answered — you read `capacity`, no data was ever lost.

**New in v7.1 — five additions, no removals.** We moved the admin list filtering server-side and built the buyer review + contact-customer-care flows, and that work surfaced: **§3.9** (`POST /api/reviews` can only review agents, so the seller/transporter review lists we already render can never be written to), **§3.10** (the `month`/`year` format we now actually send is unconfirmed on six endpoints), **§3.11** (track-order rows have no product detail or image), and **§3.12** (`/api/orders/{id}/tracking` 500s, and it is polled every 30s). §2 was trimmed to its one live question now that the sparkline code is deleted on our side.

To be clear about why this document is not shrinking: **frontend fixes do not close backend items.** We wired `contact-customer-care` this cycle, but that does not create the missing `/api/support/contacts` in §4.1. Everything below still needs you.

---

## How to read this

Everything below is **broken today**. Anything working was deleted — **if an endpoint is not in this document, it is wired, live and good.** Section numbers have gaps where items closed; that's deliberate, so references from earlier versions still resolve.

**How we test whether a route exists:** routing resolves before auth on this backend, so the status code is a reliable existence check. `401`/`403`/`405`/`400`/`404-with-JSON-body` all mean **the route exists**. A **`404` with an HTML body means it is not registered at all.** Control: `/api/this/route/does/not/exist` returns the HTML 404.

---

## 🚨 §0. SECURITY — `GET /api/bids` leaks agent credentials

**Please treat this as the top priority. It was found on 19 July while driving the app with a normal buyer account.**

`GET /api/bids`, called by the buyer bidding pages, embeds the **full agent user document** on every bid. That document includes:

| Field | What it is |
|---|---|
| `password` | the agent's **bcrypt hash** (`$2b$10$…`, 60 chars) |
| `refreshToken` | a **live refresh token** (264 chars) |
| `refreshTokenExpiry`, `tokenVersion`, `verificationTokenExpiry` | session/verification internals |

Confirmed on **all 16 bids** returned to an ordinary authenticated buyer — no admin role needed. A refresh token is enough to mint access tokens for that agent, so this is an **account-takeover path**, and the hashes are offline-crackable.

**Needed:** strip the agent object to the fields the UI actually uses (`_id`, `name`, `email`, `phone`, `state`) — a `.select()` / serializer fix. Please also audit the other endpoints that embed a populated user, since this is likely a shared populate helper rather than a one-off. **We cannot mitigate this on the frontend** — the data is already on the wire.

*(Related: `GET /api/products` and other buyer-facing routes should get the same check.)*

---

## §0.1 🔴 `GET /api/buyers/fleet-bids` — intermittent 500

Fails roughly **1 in 3** calls with a **500 and an empty body**; the other calls return a normal 200 payload. Same token, same params, seconds apart:

```
attempt 1 → 200    attempt 4 → 200
attempt 2 → 200    attempt 5 → 500   ← empty body
attempt 3 → 200    attempt 6 → 500   ← empty body
```

Called on `/buyer/my-biddings` and `/buyer/transactions`, so buyers see the fleet-bids section fail at random. Not a frontend fault — reproduced with plain `curl`.

---

## Everything still outstanding, at a glance

| § | Item | Severity | Type |
|---|---|---|---|
| **0** | **`GET /api/bids` leaks agent password hash + refresh token** | 🚨 **security** | data exposure |
| **0.1** | `GET /api/buyers/fleet-bids` 500s ~1 call in 3 | 🔴 | flaky handler |
| 1.1 | `GET /api/notifications/unread/count` | 🔴 blocker | route missing |
| 1.2 | `GET /api/customers/{id}` | 🔴 blocker | route missing |
| 1.3 | `POST /api/agents/products/{id}/restock` | 🔴 blocker | route missing |
| 1.7 | `POST /api/customers/{id}/chat` rejects every id | 🔴 blocker | broken handler |
| 5.2 | `PATCH /api/admin/users/{id}/status` rejects every id | 🔴 | broken handler *(we now call the working base route)* |
| 5.4 | `GET /api/customers` envelope + missing `state`/`image` | 🔴 | data/shape |
| 5.5 | Restocked product appears in **both** tabs | 🔴 | data integrity |
| 5.3 | Does `/payments` read `quantityToShip` as kg? | ⚠️ **possible billing bug** | needs answer |
| 2 | Dashboard deltas all return `0` — computed or stub? | 🟡 | needs answer |
| 3.1 | `GET /api/transporters/{id}` missing 4 fields | 🔴 | missing fields |
| 3.2 | `transporterId` filter ignored on `/trucks` | 🟡 | missing filter |
| 3.3 | `recentReviewers` needs avatar URLs | 🟡 | missing field |
| 3.4 | `PATCH /api/profile` accept `image` | 🟡 | missing field |
| 3.5 | `POST`/`PUT /api/farmers` accept `image` | 🟡 | missing field |
| 3.6 | `GET /api/transactions/{id}` missing commission fields | ⚠️ low | shape mismatch |
| 3.7 | `GET /api/bids` has no seller `rating` | 🔴 | missing field |
| 3.8 | Fleet-trip payload has no `amount` | 🟡 | needs answer |
| 3.9 | `POST /api/reviews` is agent-only — sellers/transporters can't be reviewed | 🔴 | contract gap |
| 3.10 | `month`/`year` filter format unconfirmed on 6 list endpoints | ⚠️ | needs answer |
| 3.11 | `/admin/track-orders` rows have no product detail or image | 🔴 | missing fields |
| 3.12 | `GET /api/orders/{id}/tracking` returns 500 (polled every 30s) | 🔴 | broken handler |
| 4.1 | `GET /api/support/contacts` | 🔴 | route missing |
| 4.2 | `GET /api/transporters/fleet/{id}/similar` | 🟡 | route missing |
| 4.3 | Transporter `recommendations` | 🟡 | missing field |
| 4.4 | No fleet-scoped wishlist endpoint | 🟡 | route missing |

**Start with §0 (the credential leak), then the 🔴 blockers**, then §5.3 — the only item that could be costing money.

Two rows above are no longer urgent for you because we routed around them: §5.2's broken `/status` route (we now call the working base route) and the whole of §2's `trend[]` work (sparklines cut from the design). Both are recorded so you know why the call pattern changed.

**One observation that may collapse two of them into a single fix:** §1.7 and §5.2 fail *identically* — `400 "Invalid customer id"` / `400 "Invalid user ID"`, returned for a real id, a well-formed unused ObjectId, and the literal string `notanid` alike. Two unrelated routes both rejecting ids before any lookup points at one shared validation helper.

**Also worth knowing:** the two things v6.2 reported as backend faults turned out to be ours — seller requests were unauthenticated (so `isFollowing` always read `false`) and buyer logout never called `/api/auth/logout`. Both are fixed on our side; those endpoints were correct throughout. We re-verified the whole v5.0 closure record under real sessions and all of it holds **except** its §3.1 (see §1.7).

---

## §1. Broken API calls

### 1.1 🔴 `GET /api/notifications/unread/count` — not registered

The navbar bell badge calls this and gets an HTML 404. It then silently falls back to counting only the notifications on the *current page* of the list, so it undercounts.

**See it:** the bell icon on any `/buyer/*` or `/transporter/*` page. Called from `notificationService.ts:112`.

```jsonc
{ "count": 12 }   // also accepts data.count or unreadCount
```

Must be the total unread across **all** pages, not just the first.
*(All four role navbars — buyer, transporter, agent and admin — now call this, so the badge undercounts everywhere until the route exists.)*

### 1.2 🔴 `GET /api/customers/{id}` — not registered

The list route works; the detail route doesn't. The `[id]` segment exists but has no handler of its own, and its one child route is broken (§1.7).

**See it:** `/agent/customers` → click a row → Customer Info modal. Called from `customerService.ts:152`.
**Workaround in place:** the page reuses the list row instead (`agent/customers/page.tsx:217`). The transporter equivalent `GET /api/transporters/customers/{id}` exists and works — copy it.

```ts
{ id, name, state, revenue, orders, mobile, date,   // date = ISO
  image?, email?, address?, lastOrderAt? }
// tolerated aliases: _id · fullName · location · totalSpent · ordersCount · phone · createdAt · avatar
```

### 1.3 🔴 `POST /api/agents/products/{productId}/restock` — not registered

The Restock modal is fully built and wired; the button only throws. `POST /api/products/{id}/restock` and `PATCH /api/agents/products/{id}/restock` don't exist either — we probed both.

**See it:** `/agent` → Out of Stock panel → Restock → enter quantity → Submit. Called from `agentDashboardService.ts:267`.

```ts
// we send
{ quantity: number,        // required, > 0, validated client-side
  restockDate?: string }   // "YYYY-MM-DD"
// we need back: the updated product, or at minimum { success: true }
```

### 1.4 ⬜ `GET /api/farmers/products/pending` — **DO NOT BUILD**

Raised only so you don't build it by mistake. The service method has zero callers. `GET /api/products/pending` exists but returns a **500 with an empty body** — that looks like the intended route, half-built. Tell us which path is canonical and fix the 500, or we delete the dead method (`productService.ts:423`). Do not prioritise over §1.1–§1.3.

*§1.5 (`GET /api/reviews` + `/summary`) is closed — it now scopes to the bearer token without `agentId`, exactly as asked. The one follow-on is §3.3: `recentReviewers` still needs avatar URLs.*

### 1.7 🔴 `POST /api/customers/{id}/chat` — rejects every customer id

Your v5.0 update named this as the route for agent-facing customer support. It returns `400 Invalid customer id` for **every** id, including ids your own API returned to us. The frontend is correct and unchanged; no frontend fix is possible.

**See it:** `/agent/customers` → Support action → Subject + Message → Start Chat. Called from `customerService.ts:175`.

| `{id}` sent | Source | Response |
|---|---|---|
| `696f7f7ab3e9c64e9697d0b9` | real user from `GET /api/admin/users` | 400 Invalid customer id |
| `696f6c0a719a3fcdb97c3e16` | real user from `GET /api/admin/users` | 400 Invalid customer id |
| `000000000000000000000000` | valid ObjectId, no such user | 400 Invalid customer id |
| `notanid` | not an ObjectId at all | 400 Invalid customer id |

**The diagnostic:** a real user's id gives the same error as the literal string `notanid`. A working handler would distinguish malformed-id from no-such-customer from not-your-customer. One response for all four means **the id is rejected before any lookup happens.**

**The control that rules out a data problem** — same id, same session, transporter-scoped route: `POST /api/transporters/customers/696f7f7ab3e9c64e9697d0b9/chat` → **201 Created**. The customer exists and resolves fine; only the generic route fails.

**Not a role problem either.** We switched `activeRole` to `agent` via `PATCH /api/profile/switch-role` and got the identical 400 — and a role failure on this backend returns `403 "…access required"`, not a 400.

**Re-verified 19 July with a real agent session** — unchanged, still `400` for a real id and for `notanid` alike.

**We need:** re-check the deployed handler's id validation. Or, if this route isn't meant to serve agents, tell us to point the modal at `/api/transporters/customers/{id}/chat` and confirm that route accepts an agent token.

> **On the v5.0 closure record:** that document's UPDATE section states the generic route "should be used for agent-facing customer support flows" and that "Swagger already updated". **Swagger being updated is not the same as the handler working** — the documented route rejects every id we send it. Its §3.1 should be reopened. Everything else in that record we re-tested holds up: L1, L2, T11/S4, S7, banners and admin stats all returned 200 with correct data, and the seller payload carries `isFollowing`, `ratingDistribution`, `phoneNumbers` and `recommendations` correctly under a real session.

---

## §2. Dashboard overview — every delta is `0`

> **✅ The `trend[]` ask is withdrawn** — sparklines are cut from the design, and the dead code is now deleted on our side. Nothing is pending on your side for the charts.

**The one thing still worth a reply — every delta is `0`.** With the sparklines gone, the delta chip is the *only* comparative element on the tile, so it matters more than it did:

```jsonc
// GET /api/agents/dashboard/overview — actual response today
{ "revenue": 218632000, "orders": 11, "customers": 1, "products": 8, "farmers": 2,
  "deltas": { "revenue": 0, "orders": 0, "customers": 0, "products": 0 } }
```

Every metric returns `0`, on every role's endpoint. **Are deltas actually being computed?** If they're a stub, say so and we'll hide the chips rather than render a meaningless "0%" on every tile — the same call we made on the fake sparklines.

**Minor:** the agent payload carries a **`farmers`** metric that has no tile in our UI. Tell us if it's meant to be shown.

---

## §3. Missing fields on endpoints that otherwise work

### 3.1 🔴 `GET /api/transporters/{id}` — 4 missing fields = 3 hardcoded widgets

**See it:** `/buyer/transporter-list/[id]`. **Proof it's fake:** open two different transporters — the star breakdown and phone numbers are identical on both.

| Widget | `TransporterHeader.tsx` | Currently |
|---|---|---|
| Rating bars 5★→1★ | `:29-38` | Same five numbers for every transporter |
| Phone numbers | `:24-25`, `:41` | Hardcoded `09034145971/2` |
| Reviewer avatars | `:273-299` | Hardcoded `/images/bidder1..4.png` |

```ts
// add to the response
ratingDistribution: { rating, count, percentage }[];   // 5 entries, 1..5
totalReviews: number;
phoneNumbers: string[];
recentReviewers: { id, name, avatar }[];               // avatar = URL
```

**Verified 19 July under a real session** — `GET /api/transporters/{id}` returns `_id, email, roles, name, status, address, phone, state, rating, reviewsCount, totalSales, drivers, fleet…` and **none** of the four fields above. (`recommendations`, the fifth gap on this same endpoint, is §4.3.)

**`GET /api/sellers/{id}` returns all five today** — we confirmed `ratingDistribution`, `phoneNumbers`, `recommendations`, `totalReviews` and `isFollowing` all present on a live authenticated call. **So §3.1 and §4.3 are really one task:** port the seller implementation onto the transporter endpoint and both close together.

### 3.2 `GET /api/transporters/trucks` — needs a `transporterId` filter

The "Almost Full" and "Empty Trucks" grids on a *specific* transporter's profile list **every** transporter's trucks.

**Confirmed the param is ignored, not just unsent:** passing `transporterId=000000000000000000000000` — an id that matches nothing — still returns the same truck as passing no filter at all. So this is server-side, not just our missing param.

Please accept `transporterId`; we'll pass the route param. Called from `AlmostFullTruck.tsx:16`, `EmptyTruck.tsx:16`.

### 3.3 `recentReviewers` needs avatar URLs

Currently comes back as buyer *names*, not URLs, so the frontend renders the first letter in a grey circle (`reviewService.ts:186`). Return `{ id, name, avatar }[]` with a real URL. (Blocked behind §1.5 — fix that first or you'll see nothing.)

### 3.4 `PATCH /api/profile` — accept an `image` field

Every profile page (`/buyer-profile`, `/agent-profile`, `/transporter-profile`) shows the same stock PNG for every user, with a camera badge that has no click handler and no file input.

We upload to Cloudinary ourselves (as we already do for products and banners) and send you only the URL. Please accept `{ image?: string }` on `PATCH /api/profile` and return `image` on `GET /api/profile`.

### 3.5 `POST`/`PUT /api/farmers` — accept a farmer `image`

The upload UI works, reads the file, and the mapper then silently drops it — every farmer avatar is hardcoded back to the default (`FarmerService.ts:87`). **See it:** `/agent/farmers` → Onboard Farmer → Change Image → save; the list still shows the default avatar.

We'll send a Cloudinary URL. Please accept `image?: string` on create + update and return it on `GET /api/farmers`.

### 3.6 ⚠️ `GET /api/transactions/{id}` — missing the commission fields the list returns

Re-verified 19 July: **14/14** list items carry `commissionRate` and `commissionAmount` (e.g. `0.1` / `5300`). The detail route for that same id returns `paymentConfirmation, paymentReference, _id, order, buyer, amount, status, paymentMethod, approvedBy…` — **both commission fields absent.**

Two incidental notes: the detail route is **buyer-role only** (agent and admin tokens both get `403 "Buyer access required"`), and it nests under a top-level `transaction` key while the list nests under `data.transactions` — another envelope inconsistency in the family of §5.4.

**Impact today: none user-visible** — the details modal is fed from the already-fetched list row. Raised because two shapes for one resource is a trap for whoever next wires a detail view against `/{id}` and gets a silently `undefined` commission. **Low priority.**

### 3.7 🔴 `GET /api/bids` — no seller rating, so the seller stars can't render

`/buyer/my-biddings` shows each won bid's seller. There is **no rating anywhere in the payload** — verified across **16 live bids**: no `rating` field on the bid, and none on the embedded agent object either.

We previously told you "the rating data is already in your response." That was wrong, and we've corrected it. The star row there was fabricated, so **we removed it** rather than keep inventing a value.

**Needed:** a seller `rating` (and ideally `reviewsCount`) on the bid's agent object.

### 3.8 Fleet-trip payload — no `amount`

The Amount column on `/admin/track-orders/track-transporter` is hardcoded `"—"` because the fleet-trip payload carries no amount. **If an amount exists on the trip, please add it — otherwise say so and we'll drop the column.**

### 3.9 🔴 `POST /api/reviews` — only reviews **agents**, so sellers and transporters can't be reviewed

We just built the buyer-facing review submission UI against the existing contract:

```
POST /api/reviews   { agentId, rating, comment }
```

That works, and buyers can now review agents. But the payload is **agent-only by construction** — there is no way to express "review this seller" or "review this transporter", even though both already have working *read* endpoints that the UI renders:

- `GET /api/sellers/{id}/reviews` ✅ in use
- `GET /api/transporters/{id}/reviews` ✅ in use

So today we can **display** seller and transporter reviews but no one can ever **write** one. Whatever is in those lists can only have been seeded outside the product.

**Needed — one of:**

1. A polymorphic payload, e.g. `{ revieweeId, revieweeType: "agent" | "seller" | "transporter", rating, comment }` (keep `agentId` accepted as a deprecated alias so nothing breaks), **or**
2. Sibling routes `POST /api/sellers/{id}/reviews` and `POST /api/transporters/{id}/reviews` mirroring the existing GETs.

**We'd prefer (1)** — it keeps one moderation/aggregation path and one rating-recompute trigger. Please confirm which you'll do before we build the seller/transporter review entry points; the UI is otherwise ready to reuse.

Related: whichever you pick, confirm it recomputes the reviewee's aggregate `rating` — §3.7 is currently blocked on sellers having no rating at all, and these two are likely the same missing aggregation.

**Two more answers we need now that buyers can actually post reviews:**

1. **What happens on a second `POST /api/reviews` for the same agent by the same buyer?** Is it rejected, does it overwrite, or does it create a duplicate? We currently hide the button after a successful submit using local component state only — so a page refresh brings it back. We deliberately did not invent a `hasReviewed` field. If you add one to the order payload (or reject duplicates with a distinguishable error code) we'll gate on it properly.
2. **A review has no order reference.** `{ agentId, rating, comment }` attaches the review to the *agent*, not to the purchase. So a buyer with five delivered orders from one agent is offered the review button five times, and nothing ties a review to the transaction that earned it. If reviews are meant to be per-order, the payload needs an `orderId` — please confirm the intended semantics.

**One thing to verify on your side:** we derive `agentId` from `products[0].product.owner._id` on `GET /api/orders`, because the order payload has **no `agent` field**. That relies on `owner` being populated as an object rather than a bare id string. It is populated today, but it's an implicit contract — if `owner` ever comes back unpopulated the review button silently disappears (we render it only when the id resolves, rather than posting a fabricated one). **An explicit `agent` field on the order would remove the guesswork.**

### 3.10 ⚠️ `month` / `year` filter format is unconfirmed on every list endpoint

We just moved search/year/month filtering from client-side to server-side across the admin lists, so these params are now actually being sent — previously they were accepted by our service layer and never populated.

We send:

```
?year=2024&month=3        // month is 1–12, unpadded; year is a 4-digit string
```

on `/api/admin/users`, `/api/admin/users/removed`, `/api/admin/approvals/agents`, `/api/admin/approvals/transporters`, `/api/admin/orders/track/agent`, and `/api/transporters/negotiations`.

**Please confirm this is what the handlers expect** — specifically whether `month` should be `3`, `"03"`, or `"Mar"`, and that `month` without `year` is interpreted sensibly (we allow it). If any endpoint silently ignores an unrecognised value rather than erroring, the filter will look broken to users while returning HTTP 200, which is the hardest version of this to notice.

Worth knowing why we're asking: the client-side month filter we just deleted was comparing `date.startsWith("MM")` against a `YYYY-MM-DD` string, so **it had never matched anything** — month filtering has been silently broken in the UI, not merely page-scoped. We have no working reference behaviour to compare against.

### 3.11 🔴 `/admin/track-orders` rows carry no product detail or image

Both track-order lists — `GET /api/admin/orders/track/agent` and the fleet-trip feed behind `/admin/track-orders/track-transporter` — return enough to identify an order but not enough to *recognise* one. The Produce column renders a name and a thumbnail, and today both are guesswork: we fall back through `raw.title → raw.name → product.name`, and through `raw.image → product.image → images[0] → /images/noData.png`. Most rows land on the placeholder image.

An admin scanning this board is trying to answer "which produce, how much of it, from whom" at a glance. Right now they can't without opening each row.

**Needed on every track-order row, per product line:**

| Field | Why |
|---|---|
| `product.name` | Produce column title — currently inferred |
| `product.images[]` (or a single `image`) | Thumbnail — currently the placeholder on most rows |
| `product.description` | Rendered as the sub-line under the title |
| `quantity` + `unit` | "how much" — not available at all today |
| `product.category` | Lets us group/filter the board |
| `product._id` | Needed to link a row through to the product |

Orders spanning multiple products should return the full line array rather than just the first — we currently render `products[0]` and silently drop the rest, which is misleading on multi-product orders.

Same shape as the transaction detail panel already returns for `order.products[].product` would be ideal — that one is populated correctly, so this is likely a `.populate()` missing on the track-order queries rather than new work.

### 3.12 🔴 `GET /api/orders/{id}/tracking` — 500s

Observed repeatedly on order `69fb1310ef7cd7ab52b7cbd5` from `/buyer/transporter-list`. Returns **500**, not a 4xx, so this is a handler fault rather than a bad request on our side.

This endpoint is **polled every 30 seconds** while a package is in motion (buyer track-orders map and the agent trackorder view both use it), so one broken order generates sustained error traffic for as long as the page is open. We have reduced our side of the amplification — retries on this query are now disabled, since the next poll is the natural retry — but the underlying 500 needs fixing.

**Please check what this handler does when tracking/GPS data does not exist for an order yet.** If the answer is "throws", it should return `200` with a null/empty position instead — "no GPS fix yet" is a normal state for an order that hasn't been picked up, not an error. We already render that case gracefully.

---

## §4. New endpoints for currently-hardcoded UI

### 4.1 🔴 `GET /api/support/contacts` — customer-care numbers

Not registered. The same three fake numbers are hardcoded in four modals: `/agent/pending`, `/agent/received`, `/transporter/pending` (row ⋮ → Customer Care) and `/buyer/transactions` (row ⋮ → Live Chat — where the same number is listed twice).

```ts
{ id: string; label: string; number: string }[]
```

*(`POST /api/transactions/{id}/contact-customer-care` exists and works; we will wire it alongside this endpoint.)*

### 4.2 `GET /api/transporters/fleet/{fleetId}/similar` — similar fleets

Not registered. The "Similar Fleet" rail is four fake trucks exported from the component itself — Monster Truck, Heavy Duty Hauler, Freight Master, Cargo King (`SimilarFleet.tsx:11-56`) — identical on every booking page.

**See it:** `/buyer/transporter-list/booking-transporter/[id]`, bottom-right rail.

```ts
{ id, image, truckName, rating, amountPerKg,
  fullLoad, spaceRemaining, locationFrom, locationTo }[]
```

### 4.3 Transporter recommendations

The "Recommendation" rail on `/buyer/transporter-list/[id]` is six copies of the same truck photo, on every transporter. The `transporterId` prop is explicitly `eslint-disable no-unused-vars`.

**The seller equivalent already works** — `GET /api/sellers/{id}` returns a `recommendations` array. Simplest fix: add the same to `GET /api/transporters/{id}` — `{ id, name, image }[]`.

### 4.4 Fleet wishlist — no fleet-scoped endpoint exists

The "save" heart on a truck (`/buyer/transporter-list/booking-transporter/[id]`) has nowhere to post. **`POST /api/wishlist` is strictly product-scoped:**

```
POST /api/wishlist { productId: <a real fleet id> }    → 404 "Product not found"
POST /api/wishlist { productId: <a real product id> }  → 201 Created
```

**Please either add a fleet-scoped wishlist (e.g. `POST /api/wishlist/fleets` or accept a `fleetId`), or tell us to remove the heart** and we'll drop it from the design.

*(Correcting our own earlier report: we said this heart "writes to localStorage instead of calling the API." It does neither — the control has no handler at all.)*

---

## §5. Contract mismatches & data-integrity bugs

*§5.1 (fleet `capacity` vs `size`) is closed — you read `capacity`, both keys are accepted, no fleet was ever stored without a capacity. The matching frontend type has been corrected on our side.*

### 5.2 🔴 `PATCH /api/admin/users/{id}/status` — rejects **every** user id

Not a duplicate-route tidiness issue, as v6.2 filed it. **The `/status` route is broken**, and it is the one three admin pages call — so **Suspend/Activate is failing in production on `/admin/active`, `/admin/suspended` and `/admin/removed`.**

| id sent | Source | `/status` route | base route (control) |
|---|---|---|---|
| `696e78adc9579a7e9836523a` | real suspended user | 🔴 `400 Invalid user ID` | ✅ `200` |
| `696e6438889ffabb63e5fa6b` | real suspended user | 🔴 `400 Invalid user ID` | ✅ `200` |
| `000000000000000000000000` | valid ObjectId, unused | `400 Invalid user ID` | — |
| `notanid` | not an ObjectId | `400 Invalid user ID` | `400 Invalid user ID **format**` |

**The control is decisive.** The base route distinguishes a real id (200) from a malformed one ("Invalid user ID **format**"). `/status` returns the *same* message for all four, so **the id is rejected before any lookup** — the identical signature to §1.7.

**Also confirmed: `profession` is not required.** `PATCH /api/admin/users/{id}` with `{status}` alone returns 200. We have therefore stopped sending it.

**We need:** fix the `/status` handler's id validation, **or** tell us it's deprecated and we'll point all five admin pages at `PATCH /api/admin/users/{id}`, which works correctly today. We'd prefer the latter — one route, and it already works.

*(Tested idempotently: both targets were already `suspended` and were written back to `suspended`. No user's state was changed.)*

### 5.3 ⚠️ Fleet-bid quantity units — **half answered, one open question**

**The bids route is confirmed correct.** We submitted live bids and read back what was stored:

```jsonc
// POST /api/transporters/fleet/{id}/bids  →  stored:
{ "quantity": 1, "unit": "kg", "loadWeightKg": 1,
  "loadWeightTonnes": 0, "equivalent50kgBags": 0.02, "loadDisplay": "1 kg" }
```

So `quantity` **is kilograms** and the frontend's negotiate branch is right. Two incidental findings: the route also requires an **`orderId`** per shipment item (undocumented in our notes), and it accepts `quantityToShip` as an alias for `quantity`.

**The open question is the payments route.** Every fleet on the test account is `flat_rate_whole_truck` / `wholeTruckOnly: true`, so `POST /api/transporters/fleet/{id}/payments` returns `409 "This fleet only accepts whole-truck bookings"` **before** it validates `shipmentItems` — we could not reach the field validation from outside.

**So please just confirm:** does the payments route interpret `quantityToShip` as **kilograms**, like bids does? If yes, we have a **live billing bug** — the direct-payment branch sends `product.quantity` (a *unit count*, e.g. 30 bags) into a field read as 30 kg. Given bids explicitly stamps `"unit": "kg"`, we think this is likely and it's the one item here we'd ask you to check first.

### 5.4 🔴 `GET /api/customers` — malformed envelope, and two rendered fields missing

**(a) The same array comes back three times.** The list appears at `data.customers` *and* top-level `customers`; `pagination` appears twice. Wasted payload, and ambiguous about which is authoritative.

```jsonc
// please return exactly one shape
{ "success": true,
  "data": [ { /* customer */ } ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 } }
```

This matches your own convention elsewhere (`GET /api/products`, `GET /api/admin/users`) — the inconsistency is internal, not just with us. Please include `totalPages`; we compute it ourselves today. The frontend only survives this via a defensive reader in `customerService.ts` that tries `data` → `data.customers` → `customers` → `items`; we delete that once the shape is fixed.

**(b) 🔴 `state` is missing** — there is no `state`, `location` or `address` field at all, so the State column on `/agent/customers` renders **blank on every row**.
**(c) `image` is missing** — so every avatar is the placeholder.

Your object today is `{ _id, email, name, createdAt, phone, ordersCount, totalSpent, lastOrderAt }` — everything there already maps correctly. **Just add `state` and `image`.** Please use the same corrected object on `GET /api/customers/{id}` (§1.2).

### 5.5 🔴 `GET /api/products/out-of-stock` — restocked products appear in **both** tabs

**See it:** `/agent/produce-list` → Out of Stock tab → tick a product → "Back in Stock".

| Endpoint | After `status` → `"available"` |
|---|---|
| `GET /api/products` | ✅ includes it — correct |
| `GET /api/products/out-of-stock` | 🔴 **still** includes it — wrong |

The product is now in both tabs at once and the Out of Stock count is too high, permanently.

**Diagnosis — now confirmed from live data, not inferred.** We pulled both lists and compared every row. The filter is **`status === "out_of_stock" OR quantity === 0`**:

```
rice          status=available     qty=0      ← in BOTH lists
Garri         status=available     qty=0      ← in BOTH lists
spageetii     status=available     qty=0      ← in BOTH lists
Fresh Maize   status=out_of_stock  qty=1000   ← correctly in out-of-stock only
```

**3 of 8 products are in both tabs right now.** `Fresh Maize` is what proves it's an OR rather than a plain `quantity` filter: it has stock (1000) yet is still listed, so `status` is being consulted too — just not exclusively.

**This changes the ask.** `PATCH /api/products/bulk/status` can *never* fix these three, because it only clears one side of an OR — the quantity stays 0 forever. Restock has to set a quantity, which is precisely why **§1.3 is the real fix and matters more than it looked.**

**We need one of:**
- **(a) preferred** — make `/out-of-stock` filter on `status === "out_of_stock"` alone, the exact complement of `GET /api/products`. One source of truth, and the OR disappears.
- **(b)** keep the OR, but then ship §1.3 `restock` so there is an API that sets quantity — and confirm restock also flips `status`. On its own, (b) leaves the three products above stuck in both tabs.

**Not a caching artefact:** we invalidate and refetch both lists after every status change, so that's a fresh response from your endpoint. The frontend does no filtering of its own — it renders exactly the list you return (`productService.ts:482`).

---

---

## Appendix — how this audit was run

Every endpoint the frontend calls (≈130 across 25 service files) was probed live against the deployed backend, then re-verified with **real authenticated sessions** driving the actual UI in a headless browser, capturing every request the pages made.

**v7.0 went further and exercised writes**, which is what settled three items that read-only probing had left as open questions for months (§5.1, §5.2, §5.3). Writes were kept safe and reversible: the four probe fleets were **deleted**, and the admin status routes were tested **idempotently** on users already in the target state, so no user's status changed.

**One piece of test data could not be cleaned up:** two bids of ₦50,000 were created on fleet `69fb76bbe9b0c1859d580c5d` ("West Route Fleet") from the test buyer account — ids `6a5cd45c8e8a23204afc23fa` and `6a5cd45d8e8a23204afc2404`. **There is no withdraw/delete route for bids** (`DELETE /api/bids/{id}` → 405, no route under `/api/transporters/fleet/bids/{id}`), so please remove them server-side. Arguably a gap worth closing: a buyer currently cannot withdraw a bid.

The authenticated method is what makes this more accurate than a probe-only audit — it surfaced a bug where an endpoint returned 200 in every prior probe but got a field wrong *only when logged in*. Two lessons worth carrying forward:

1. **A 200 is not a pass.** Compare field values against what the UI renders.
2. **When a payload looks wrong, check the request carried its `Authorization` header** before reporting it as a backend bug. Twice, ours did not — `isFollowing` always came back `false` because seller requests were unauthenticated, and buyer logout never called `/api/auth/logout`. Both were ours; both are fixed.

Frontend coverage: every page and widget in the admin, agent, buyer and transporter sections was walked component by component to determine whether it is API-fed or hardcoded. **Anything found working was omitted by design.**
