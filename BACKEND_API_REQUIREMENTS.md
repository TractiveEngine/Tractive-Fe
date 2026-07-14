# BACKEND API REQUIREMENTS — OUTSTANDING WORK ONLY

**Project:** Tractive
**Document Version:** 6.1
**Date:** 13 July 2026 *(v6.0 — 12 July — was the full end-to-end audit)*
**Prepared by:** Frontend Engineering
**For:** Backend Engineering
**Backend audited:** `https://tractive-be.vercel.app`

---

## WHAT CHANGED IN v6.1 (read this if you read v6.0)

**Two new backend items, found by driving the app rather than probing it:**

- 🔴 **§5.5 — a restocked product stays in `GET /api/products/out-of-stock`.** It
  ends up in **both** tabs at once. The status write succeeds and `/api/products`
  picks it up correctly, so the bug is isolated to the out-of-stock query, which
  appears not to filter on `status`.
- 🔴 **§5.4 — `GET /api/customers` returns the same array three times** (at
  `data.customers`, at top-level `customers`, and `pagination` twice), **and is
  missing `state` and `image`** — so the State column on `/agent/customers` renders
  blank for every row.

**Two items closed — no longer your problem:**

- ✅ **§1.6 — `/api/products/bulk/status`.** Had *two* bugs stacked: we sent `PUT`
  (405) and, once fixed, the wrong body key (400). It wants `PATCH` with
  **`productIds`**, matching `bulk/delete`. **Fixed on our side.**
- ✅ **The banner / admin-settings item** from v6.0 is **removed entirely** — the
  Banners panel and the buyer-side banner render are confirmed working end to end.

**Changed on our side (context, not asks):** all 12 fake sparklines are now
**commented out** (§2) — they return the moment you ship `trend[]`. A batch of
frontend-only bugs was fixed; see **§6a**.

**Still the four hard blockers:** §1.1, §1.2, §1.3, §1.5 — all genuinely missing or
dead routes.

---

## HOW TO READ THIS DOCUMENT

Every item below is **something that does not work today.** Anything already
working has been deliberately removed — if an endpoint is not in this document,
it is wired, live, and confirmed good. There is no "closed items" section to
scroll past.

Each item states:
- **What is broken / missing**
- **📍 Where to see it** — the exact page(s) to open in the running app, and what
  to click to trigger the call. Log in with the role named in brackets.
- **Where the frontend calls it** (`file:line`)
- **The exact payload the frontend sends** (for POST/PATCH/PUT), and
- **The exact response shape the frontend needs** (for GET), so the UI renders.

Local dev base is `http://localhost:3000`. Paths like `[id]` mean "any record" —
open any row from the list page above it.

Sections:
- **§1 — Broken API calls.** The frontend calls these; they fail. Highest priority.
- **§2 — Sparkline / chart data.** The hardcoded SVG charts.
- **§3 — Missing fields on endpoints that otherwise work.**
- **§4 — New endpoints needed for UI that is currently hardcoded.**
- **§5 — Contract mismatches & data-integrity bugs.**
- **§6 — Frontend-side gaps.** No backend work needed; listed so you know we own them.
- **§7 — Appendix: how the audit was run.**

---

## 📍 INDEX BY PAGE — every broken screen in the app

If you'd rather work screen-by-screen than item-by-item, this is the whole
document sorted by page. **Every page listed here has something broken on it.
Every page NOT listed here works.**

### Admin
| Page | What's broken | § |
|---|---|---|
| `/admin` | sparklines **hidden** pending trend data (were fake) | §2 |
| `/admin/all-users` | sparklines **hidden** pending trend data; two competing status endpoints | §2, §5.2 |
| `/admin/active` · `/admin/suspended` · `/admin/removed` | two competing status endpoints | §5.2 |

> **Admin is otherwise clean.** Approvals, transactions, fleet-payments,
> track-orders, user suspend/remove, and the **Banners settings panel** are all
> confirmed working end to end.

### Agent
| Page | What's broken | § |
|---|---|---|
| `/agent` | **Restock button 404s**; sparklines hidden pending trend data | **§1.3**, §2 |
| `/agent/reviews` | **Page is permanently, silently empty** | **§1.5**, §3.3 |
| `/agent/customers` | **`/api/customers/{id}` 404s** (info modal); **`/api/customers` list returns a malformed envelope + is missing `state` and `image`** | **§1.2**, **§5.4** |
| `/agent/produce-list` | **"Back in Stock" leaves the product in the Out of Stock list — it ends up in BOTH tabs** | **§5.5** |
| `/agent/farmers` | farmer image silently dropped on save | §3.5 |
| `/agent/pending` · `/agent/received` | Customer Care numbers hardcoded | §4.1 |
| `/agent-profile` | profile picture cannot be uploaded | §3.4 |

### Transporter
| Page | What's broken | § |
|---|---|---|
| **every** `/transporter/*` page | **unread notification badge 404s** | **§1.1** |
| `/transporter` | sparklines **hidden** pending trend data (were fake) | §2 |
| `/transporter/fleet-list` | Add Fleet — `capacity` vs `size` field mismatch | §5.1 |
| `/transporter/pending` | Customer Care numbers hardcoded | §4.1 |
| `/transporter-profile` | profile picture cannot be uploaded | §3.4 |

### Buyer
| Page | What's broken | § |
|---|---|---|
| **every** `/buyer/*` page | **unread notification badge 404s** | **§1.1** |
| `/buyer/transporter-list/[id]` | **rating bars, phone numbers and reviewer avatars all hardcoded**; recommendations fake; truck lists not scoped to this transporter | §3.1, §3.2, §4.3 |
| `/buyer/transporter-list/booking-transporter/[id]` | "Similar Fleet" 100% fake; star row hardcoded; **kg-vs-units payload mismatch** | §4.2, §5.3, §5.6 |
| `/buyer/my-biddings` | seller stars hardcoded to 5 | §5.6 |
| `/buyer/transactions` | Live Chat hotlines hardcoded | §4.1 |
| `/buyer-profile` | profile picture cannot be uploaded | §3.4 |

> **The four things that actually block us — all missing routes:**
> **§1.1** `GET /api/notifications/unread/count` (badge — every buyer and
> transporter page) · **§1.5** `GET /api/reviews` + `/summary` (the agent reviews
> page is silently dead) · **§1.2** `GET /api/customers/{id}` · **§1.3**
> `POST /api/agents/products/{id}/restock`.
>
> Plus two **data-integrity** bugs that are just as damaging as a missing route:
> **§5.5** — a restocked product stays in `GET /api/products/out-of-stock`, so it
> appears in **both** tabs at once · **§5.4** — `GET /api/customers` returns a
> malformed envelope and is missing `state` and `image`.

---

## §1. BROKEN API CALLS — the frontend calls these and they fail

### 1.1 🔴 `GET /api/notifications/unread/count` — **ROUTE DOES NOT EXIST**

The unread notification badge in the navbar calls this. It returns a 404 HTML page.

**📍 Where to see it:**
| Role | Pages | What to look at |
|---|---|---|
| **Buyer** | **every** `/buyer/*` page + every `/buyer-profile/*` page | the bell icon in the top navbar |
| **Transporter** | **every** `/transporter/*` page | the bell icon in the top navbar |

The badge is rendered by the shared navbar in the buyer and transporter **layouts**,
so it is on-screen on every page in those two sections. Easiest single page to
check: **`/buyer`** or **`/transporter`**.

> Agent and Admin navbars do **not** call this — their badges are a frontend
> placeholder (`useState(false)`, never wired). That's our gap, not yours (§6).

- **Called from:** [notificationService.ts:112](src/services/notificationService.ts#L112) → `useNotificationCenter()` → [Navbar.tsx](src/components/nav/Navbar.tsx) (buyer) and [TransporterNavbar.tsx](src/components/nav/TransporterNav/TransporterNavbar.tsx)
- **Impact:** the badge silently falls back to counting only the notifications in the current page of the list, so it undercounts.

**Response the frontend needs:**
```json
{ "count": 12 }
```
The reader accepts `count`, `data.count`, or `unreadCount` — any of the three is fine.
It must be the **total unread across all pages**, not just the first page.

---

### 1.2 🔴 `GET /api/customers/{id}` — **ROUTE DOES NOT EXIST**

`GET /api/customers` (the list) works. The **detail** route does not.
Curiously, `POST /api/customers/{id}/chat` under the same prefix *does* exist —
so the `[id]` segment is registered but has no `route.ts` of its own.

**📍 Where to see it:** **`/agent/customers`** *(log in as Agent)* → click any
customer row → the **Customer Info** modal.

- **Called from:** [customerService.ts:152](src/services/customerService.ts#L152)
- **Current workaround:** the agent Customers page **deliberately does not call it** and reuses the row from the list instead — see the comment at `src/app/(main)/agent/customers/page.tsx:217`. The transporter equivalent (`GET /api/transporters/customers/{id}`) **does** exist and works.

**Response the frontend needs** (aliases in parentheses are already tolerated):
```ts
{
  id: string;              // or _id
  name: string;            // or fullName
  state: string;           // or location
  revenue: number;         // or totalSpent / totalRevenue
  orders: number;          // or ordersCount / orderCount / totalOrders
  mobile: string;          // or phone / phoneNumber
  date: string;            // or createdAt (ISO)
  image?: string;          // or avatar / profileImage
  email?: string;
  address?: string;
  lastOrderAt?: string;
}
```

---

### 1.3 🔴 `POST /api/agents/products/{productId}/restock` — **ROUTE DOES NOT EXIST**

The **Restock modal** on the agent dashboard is fully built and wired, and the
button does nothing but throw.

**📍 Where to see it:** **`/agent`** *(log in as Agent — this is the dashboard
landing page)* → the **"Out of Stock"** panel on the right → click **Restock** on
any product → enter a quantity → **Submit**. The request 404s.

- **Called from:** [agentDashboardService.ts:267](src/services/agentDashboardService.ts#L267) ← [OutOfStock.tsx:32](<src/app/(main)/agent/_components/OutOfStock.tsx#L32>)
- Neither `POST /api/products/{id}/restock` nor `PATCH /api/agents/products/{id}/restock` exist either — we probed both.

**Payload the frontend sends:**
```ts
{
  quantity: number;        // required, > 0 (validated client-side)
  restockDate?: string;    // optional, "YYYY-MM-DD"
}
```

**Response needed:** the updated product, or at minimum `{ success: true }`.
On success the frontend invalidates the out-of-stock and product-list queries.

---

### 1.4 🟡 `GET /api/farmers/products/pending` — missing, but **NO PAGE USES IT YET** (low priority)

**📍 Where to see it: nowhere.** There is **no page** for this. The service method
`getPendingProducts()` exists but **has zero callers** in the frontend — we
confirmed by grep. No UI has been built for a pending-products queue.

Raising it only so the record is complete and you don't build it by mistake:
- The route `GET /api/farmers/products/pending` returns an **HTML 404** (not registered).
- `GET /api/products/pending` **does** exist but **returns a 500** with an empty body — that looks like the intended route, half-built.

**Action: none needed from you right now.** If a pending-products screen is on the
roadmap, tell us which of the two paths is canonical and fix the 500; otherwise we
will delete the dead service method. **Do not prioritise this over §1.1–§1.3.**

- Dead code at [productService.ts:425](src/services/productService.ts#L425)

---

### 1.5 🔴 `GET /api/reviews` and `GET /api/reviews/summary` — **SILENTLY DEAD**

Both routes exist but **require an `agentId` query param that the frontend never
sends**, so both return `400 {"message":"agentId required"}`. The frontend then
**swallows the 400** ([reviewService.ts:145](src/services/reviewService.ts#L145))
and falls back to deriving the summary from an empty list.

**📍 Where to see it:** **`/agent/reviews`** *(log in as Agent)*. The page loads
with **zero reviews, an overall rating of 0.0, and all five rating bars empty** —
even for an agent who has reviews in the database. There is **no error message**;
it looks exactly like a brand-new account. Open DevTools → Network to see the
`400 agentId required`.

**Net effect: the agent Reviews page shows a permanent, silent empty state.**
No error appears in the UI. Nobody has noticed because it looks like "no reviews yet".

We probed the alternatives: `sellerId`, `transporterId`, and `userId` **all still
return `agentId required`.** So there is currently no way for a seller or a
transporter to read their own review summary through this route.

**What we need — one of:**
- **(a) Preferred:** make `agentId` **optional**. When omitted, scope the reviews to the **authenticated user** (we always send a Bearer token). This is the natural behaviour for a "my reviews" page.
- **(b)** Accept `sellerId` / `transporterId` as alternatives to `agentId`.

**Response shape the frontend needs from `/api/reviews/summary`:**
```ts
{
  overallRating: number;          // e.g. 4.3
  totalReviews: number;
  ratingDistribution: {
    rating: number;               // 1..5
    count: number;
    percentage: number;           // 0..100
  }[];
  recentReviewers: {              // for the avatar stack
    id: string;
    name: string;
    avatar: string;               // MUST be a URL — see §3.3
  }[];
}
```
This exact shape already works when `agentId` is supplied — we confirmed a live
`200`. The only change needed is the scoping rule.

---

### 1.6 ✅ `PATCH /api/products/bulk/status` — **RESOLVED. No backend work needed.**

Recorded because it was broken in two ways and both are now fixed **on our side**.

1. **Wrong method.** We sent `PUT`; the backend only registers `PATCH` (`PUT` and
   `POST` return **405**). → switched to `PATCH`.
2. **Wrong body key.** We sent the id array as **`products`**, which the backend
   rejected with **`400 Bad Request`**. The correct key is **`productIds`** — the
   same key `bulk/delete` already uses. → switched.

**The contract we now send** (covers both "Out of Stock" and "Back in Stock" on
`/agent/produce-list`):

```jsonc
PATCH /api/products/bulk/status
{
  "productIds": ["6993d5fc65003a85c34e795b", "69c0b72bc11cf3d869dcb93c"],
  "status": "available"        // | "out_of_stock" | "discontinued"
}
```

**Nothing is required from you.** One optional cleanup for the future: `bulk/delete`
and `bulk/status` now agree on `productIds`, but the 400 gave no readable validation
message — if the error body named the offending field, we would have found this in
seconds instead of by inference.

---

## §2. SPARKLINE CHART DATA — the hardcoded SVGs

> This is the "charts drawn as hardcoded SVG" item you asked about.

### 2.1 The 12 fake sparklines

Every dashboard stat tile renders a little trend line beside the number. **All of
them are a literal, hardcoded SVG `<path d="...">` string.** The `d=` attribute
is **byte-for-byte identical** across admin, agent, and transporter — we diffed
the three files.

**📍 Where to see them — open these 4 pages, look at the stat tiles across the top:**

| # | Page | Role | Sparklines | Status | Component |
|---|---|---|---|---|---|
| 1 | **`/admin`** | Admin | 4 (User, Received Payment, Orders, Visitors) | ✅ **commented out** | [SmallChart.tsx](<src/app/(main)/admin/_components/SmallChart.tsx>) |
| 2 | **`/admin/all-users`** | Admin | 5 (Total, Active, Suspended, Removed, Agents) | ✅ **commented out** | same |
| 3 | **`/agent`** | Agent | 4 (Revenue, Customers, Orders, Products) | ✅ **commented out** | [SmallChart.tsx](<src/app/(main)/agent/_components/SmallChart.tsx>) |
| 4 | **`/transporter`** | Transporter | 4 (Revenue, Customers, Fleets, Drivers) | ✅ **commented out** | [SmallChart.tsx](<src/app/(main)/transporter/_components/SmallChart.tsx>) |

**All 12 sparklines are now commented out.** We would rather show nothing than ship
a fabricated trend line — the tiles currently render the number and the delta chip
only, which are both real. **Nothing is broken on screen today.**

This section stays open because it is a **feature we cannot build without you**:
the moment `trend` lands, we uncomment all 12 and they become real. Until then the
dashboards are missing a designed element.

> For reference, the bug we removed: the `d=` path was byte-identical on every
> tile, and the green/red variant was picked at config time rather than from the
> data — so the Orders/Fleets tile drew a red *downward* line even when its delta
> was positive. It contradicted the real number printed next to it.

The components take **no props at all**. Two consequences:
1. Every tile shows the **same squiggle** regardless of its real value.
2. The green/red variant is **chosen at config time, not from the data.** The
   Orders tile is hardcoded to the red *downward* line — so it renders a decline
   even when `deltaPercent` is positive. It is currently misinformation, not just
   decoration.

**Important: the tile *numbers* and *deltas* are already real** — they come from
`/api/{admin,agents,transporters}/dashboard/overview`, which work fine. **Only the
trend line is fabricated.** So this is a small, additive change, not a new endpoint.

### 2.2 What we need — add `trend[]` to the existing `OverviewBlock`

The overview endpoints today return, per metric:

```ts
// current — works
interface OverviewBlock {
  value: number;
  deltaPercent: number;
}
```

**Please add a `trend` array:**

```ts
// needed
interface OverviewBlock {
  value: number;
  deltaPercent: number;
  trend: { date: string; value: number }[];   // ← ADD THIS. 7 points.
}
```

- **7 points**, one per day for the last 7 days (oldest first).
- `date`: ISO date string, e.g. `"2026-07-06"`.
- `value`: the metric's value **on that day** (not cumulative).
- If a metric genuinely has no history, return `trend: []` — we will render a
  flat line rather than a fake one.

This is the **same `{date, value}` shape** the revenue charts already return
(`RevenuePoint`), so it should be cheap to produce.

**Apply to all three endpoints, for every metric key:**

| Endpoint | Metric keys needing `trend` |
|---|---|
| `GET /api/admin/dashboard/overview` | `users`, `payments`, `orders`, `visitors` |
| `GET /api/agents/dashboard/overview` | `revenue`, `customers`, `orders`, `products` |
| `GET /api/transporters/dashboard/overview` | `revenue`, `customers`, `fleets`, `drivers` |

Once `trend` arrives we will draw the polyline from the data and pick the
green/red stroke from the sign of `deltaPercent`.

### 2.3 Charts that are already correct — no action needed

Listed only so you don't hunt for them: the three **Recharts revenue area charts**
(admin/agent/transporter), the agent **most-sold-categories donut** (SVG arcs are
computed from real API values), and every **rating-distribution bar** in
`Reviews.tsx` and the seller `StoreHeader` are all genuinely API-fed and working.

The **only** fake chart data in the entire application is the 12 sparklines above,
plus the hardcoded star rows in §5.6.

---

## §3. MISSING FIELDS ON ENDPOINTS THAT OTHERWISE WORK

### 3.1 🔴 `GET /api/transporters/{id}` — missing 3 fields, so 3 widgets are hardcoded

The transporter public profile page renders three widgets from **literal arrays
baked into the component**, because the endpoint doesn't return the data.

**📍 Where to see it:** **`/buyer/transporter-list`** *(log in as Buyer)* → click
**any** transporter card → you land on **`/buyer/transporter-list/[id]`**. Look at
the header block at the top of that page.
**Proof it's fake: open two *different* transporters. The star breakdown and the
phone numbers are identical on both.**

**File:** [TransporterHeader.tsx](<src/app/(main)/buyer/transporter-list/_components/TransporterProfile/TransporterHeader.tsx>)

| Widget | Line | Currently |
|---|---|---|
| Rating-distribution bars (5★→1★) | `:29-38` | Hardcoded `[{5★,8,100%},{4★,6,75%},{3★,4,50%},{2★,2,25%},{1★,1,10%}]` — **every transporter shows these same numbers** |
| Phone numbers | `:23-26` | Hardcoded `["09034145971","09034145972"]` |
| Reviewer avatar stack | `:271-300` | Hardcoded `/images/bidder1..4.png` |

**Please add to the `GET /api/transporters/{id}` response:**
```ts
{
  // ... existing fields ...
  ratingDistribution: { rating: number; count: number; percentage: number }[];  // 5 entries, 1..5
  totalReviews: number;
  phoneNumbers: string[];
  recentReviewers: { id: string; name: string; avatar: string }[];  // avatar = URL
}
```

**Note:** `GET /api/sellers/{id}` **already returns `ratingDistribution` and
`phoneNumbers` correctly** — the seller store page renders real bars today. We
need exact parity on the transporter endpoint. Copying the seller implementation
should be sufficient.

### 3.2 `GET /api/transporters/trucks` — needs a `transporterId` filter

The "Almost Full Trucks" and "Empty Trucks" grids on a **specific transporter's**
profile page call `GET /api/transporters/trucks?status=almost_full` **without
scoping to that transporter**, so they list *every* transporter's trucks.

**📍 Where to see it:** **`/buyer/transporter-list/[id]`** *(Buyer — open any
transporter)* → scroll to the **"Almost Full Truck"** and **"Empty Truck"**
sections. **Proof: the same trucks appear on every transporter's profile.**

- **Called from:** `AlmostFullTruck.tsx:16`, `EmptyTruck.tsx:16`

**Please accept a `transporterId` query param.** We will then pass the `[id]`
route param. (Half of this is our bug — we have the id and don't send it — but the
param needs to exist server-side.)

### 3.3 `recentReviewers` should carry avatar **URLs**

On the review summary, `recentReviewers` currently comes back (when it comes back
at all) as **buyer names**, not avatar URLs. The frontend has a comment admitting
it renders the first letter in a grey circle as a placeholder
([reviewService.ts:186](src/services/reviewService.ts#L186)).

**📍 Where to see it:** **`/agent/reviews`** *(Agent)* → the small stack of
reviewer avatars under the overall rating. They render as grey letter-circles
instead of faces. *(Note: this page is also blocked by §1.5 — fix that first or
you'll see nothing at all.)*

Please return objects with a real `avatar` URL:
`{ id: string; name: string; avatar: string }[]`.

### 3.4 `PATCH /api/profile` — accept an `image` field

**Every** profile page across **every** role has a profile-picture widget with a
camera button that **has no click handler and no file input.** It is a static PNG.

**📍 Where to see it — 3 pages, same broken widget:**

| Page | Role |
|---|---|
| **`/buyer-profile`** | Buyer |
| **`/agent-profile`** | Agent |
| **`/transporter-profile`** | Transporter |

On each, the avatar at the top is the **same stock image
(`/images/profileSettingImage.png`) for every user**. Click the camera badge on it —
nothing happens. The transporter navbar avatar (`TransporterNavbar.tsx:147`) has the
same problem; its code comment even reads *"Replace with user-uploaded image if
available"*.

We will upload the file to **Cloudinary** ourselves (we already do this for
products and banners) and send you only the resulting URL.

**Please accept on `PATCH /api/profile`:**
```ts
{ image?: string }   // Cloudinary URL
```
…and **return `image` on `GET /api/profile`** so we can render the current avatar.

### 3.5 `POST` / `PUT /api/farmers` — accept a farmer `image`

The farmer create/edit modal has a working "Change Image" upload UI. The file is
read to base64 and then **silently dropped** — the mapper never forwards it
([FarmerService.ts:110-121](src/services/FarmerService.ts#L110)), and every farmer
avatar is hardcoded back to `/images/farmer_modal_profile.png`.

**📍 Where to see it:** **`/agent/farmers`** *(Agent)* → **"Onboard Farmer"** (or
edit an existing farmer) → hover the avatar → **"Change Image"** → pick a file.
The preview updates, you save, and **the image is gone** — the list still shows the
default farmer avatar for everyone.

We will move this to Cloudinary and send a URL. **Please accept `image?: string`**
on farmer create and update, and return it on `GET /api/farmers`.

---

## §4. NEW ENDPOINTS NEEDED FOR CURRENTLY-HARDCODED UI

### 4.1 🔴 `GET /api/support/contacts` — customer-care phone numbers

**Confirmed: this route does not exist.** The "Customer Care" modal appears in
**four places** and each one has the **same hardcoded fake numbers**.

**📍 Where to see it:**

| Page | Role | How to open the modal |
|---|---|---|
| **`/agent/pending`** | Agent | row **⋮** menu → **Customer Care** |
| **`/agent/received`** | Agent | row **⋮** menu → **Customer Care** |
| **`/transporter/pending`** | Transporter | row **⋮** menu → **Customer Care** |
| **`/buyer/transactions`** | Buyer | row **⋮** menu → **Live Chat** (different modal, same hardcoded-numbers problem) |

Source files:
- `src/app/(main)/agent/pending/_components/CustomerCareModal.tsx:15`
- `src/app/(main)/agent/received/_components/CustomerCareModal.tsx:15`
- `src/app/(main)/transporter/pending/_components/CustomerCareModal.tsx:15`
- `src/app/(main)/buyer/(account)/transactions/_components/LiveChatModal.tsx:14`

```ts
// what is shipping today, in all three files:
[ { id: 1, number: "+234-800-123-4567", label: "Main Support" },
  { id: 2, number: "+234-800-765-4321", label: "Technical Support" },
  { id: 3, number: "+234-800-987-6543", label: "Billing Support" } ]
```
(The buyer copy is `["+2349034145971","+2349034145971"]` — the same number twice.)

**Response the frontend needs:**
```ts
{ id: string; label: string; number: string }[]
```

> Note: `POST /api/transactions/{id}/contact-customer-care` **exists** and works,
> but no component calls it — that's a frontend gap (§6).

### 4.2 `GET /api/transporters/fleet/{fleetId}/similar` — similar fleets

**Confirmed: does not exist.** The "Similar Fleet" rail on the booking page is a
**hardcoded array of 4 fake trucks** exported from the component file itself
("Monster Truck", "Heavy Duty Hauler", "Freight Master", "Cargo King") —
[SimilarFleet.tsx:11-56](<src/app/(main)/buyer/transporter-list/_components/BookingTransport/TruckAndOwnerInfo/SimilarFleet.tsx>).

**📍 Where to see it:** **`/buyer/transporter-list`** *(Buyer)* → open a transporter
→ click **Book** on any truck → you land on
**`/buyer/transporter-list/booking-transporter/[id]`** → scroll to the bottom-right
**"Similar Fleet"** rail. **Those four trucks are fake and are the same on every
booking page in the app.**

**Response the frontend needs:**
```ts
{
  id: string;
  image: string;
  truckName: string;
  rating: number;
  amountPerKg: number;
  fullLoad: string;
  spaceRemaining: string;
  locationFrom: string;
  locationTo: string;
}[]
```

### 4.3 Transporter recommendations

`TransporterRecommendation.tsx:13-66` renders **six identical copies of
`/images/monsterTruck.png`.** It takes a `transporterId` prop that is explicitly
marked `eslint-disable no-unused-vars`.

**📍 Where to see it:** **`/buyer/transporter-list/[id]`** *(Buyer — open any
transporter)* → the **"Recommendation"** rail. It is six copies of the same truck
photo, on every transporter.

The **seller** equivalent already works — `GET /api/sellers/{id}` returns a
`recommendations` array and `StoreRecommendation.tsx` renders it.

**Simplest fix: add a `recommendations` array to `GET /api/transporters/{id}`,**
mirroring the seller shape: `{ id: string; name: string; image: string }[]`.

---

## §5. CONTRACT MISMATCHES & DATA-INTEGRITY BUGS

### 5.1 ⚠️ Fleet create — we send `capacity`, your contract says `size`

The Add Fleet form sends **`capacity`**, but our own `FleetPayload` type declares
**`size`**. The form uses two `as any` casts to force it through
([AddFleet.tsx:220,237](<src/app/(main)/transporter/fleet-list/_components/AddFleet.tsx>)).

**📍 Where to see it:** **`/transporter/fleet-list`** *(Transporter)* → **"Add
Fleet"** → fill the form → **Submit**. Inspect the request body in DevTools →
Network to see which field name actually goes over the wire.

**Please confirm which field name the backend actually reads.** We'll align to you.

**Payload currently sent to `POST /api/transporters/fleets`:**
```ts
{
  fleetName: string;
  fleetNumber: string;
  iot: string;
  model: string;
  capacity: string;              // ⚠️ or should this be `size`?  Value is a TONNAGE, e.g. "20 tons"
  price: number;
  priceNegotiation: boolean;
  images: string[];              // Cloudinary URLs
  fleetDescription: string;
  fleetStates: "available" | "under_maintenance";
  route: { fromState: string; toState: string };
}
```

**The value is a tonnage** (e.g. `"20 tons"`) — so `capacity` and `size` are two
names for the same thing. We only need to know **which key you read.**

**Why this is worth a reply and not just a shrug:** the two `as any` casts mean
nobody currently knows. There are two possibilities and they look identical from
the outside:
- You read **`capacity`** → it works, and our type definition is simply wrong and will mislead the next developer.
- You read **`size`** → **every fleet has been created with no capacity at all**, silently defaulting or nulling, and nobody has noticed because the create call still returns success.

**Quickest way to settle it:** create a fleet, then `GET` it back and see whether
the tonnage came through. If it's empty, you read `size`.

### 5.2 ⚠️ Two competing endpoints for the same admin action

Suspending/activating a user goes through **two different routes** depending on
which admin page you're on.

**📍 Where to see it — do the same action on two pages and watch the Network tab:**

| Page (Admin) | How to trigger | Endpoint hit | Body |
|---|---|---|---|
| **`/admin/all-users`** and **`/admin/all-users/[id]`** | row **⋮** → Suspend | `PATCH /api/admin/users/{id}` | `{ status, profession }` |
| **`/admin/active`**, **`/admin/suspended`**, **`/admin/removed`** | row **⋮** → Suspend | `PATCH /api/admin/users/{id}/status` | `{ status }` |

Both exist and both return 401 (i.e. registered). **Please tell us which is
canonical** and we will delete the other call path. Note the first requires a
`profession` field that we have to derive client-side — and if we can't derive it,
we abort the action with an error toast. If `/status` is canonical, that whole
problem disappears.

### 5.3 ⚠️ Fleet-bid quantity unit mismatch — **possible billing bug**

For the same product line, two flows send different units.

**📍 Where to see it — both start at
`/buyer/transporter-list/booking-transporter/[id]`** *(Buyer → transporter → Book a
truck)*. Select some products to ship, then take **each** branch and compare the
two request bodies in the Network tab:

| Branch | How to trigger | Field sent | Unit |
|---|---|---|---|
| **Negotiate** | click **"Negotiate"**, enter an amount, submit → `POST /api/transporters/fleet/{id}/bids` | `shipmentItems[].quantity` | **kilograms** (`product.weightNum`) |
| **Direct payment** | click **"Proceed"** through to step 3 and pay → `POST /api/transporters/fleet/{id}/payments` | `shipmentItems[].quantityToShip` | **units** (`product.quantity`) |

Different field name *and* different unit. **Please confirm what each route
expects.** If the backend treats both as the same thing, shipments booked via
negotiation are being costed on a different basis from direct bookings.

### 5.4 🔴 `GET /api/customers` — **response envelope is inconsistent, and two fields the table renders are missing**

**📍 Where to see it:** **`/agent/customers`** *(log in as Agent)* — this is the
list that backs the whole page.

#### (a) The same array is returned THREE times

This is the actual response today:

```jsonc
{
  "success": true,
  "data": {
    "customers": [ { ...customer } ],      // ← copy 1
    "pagination": { "page": 1, "limit": 20, "total": 1 }
  },
  "customers": [ { ...customer } ],        // ← copy 2 (duplicate)
  "pagination": { "page": 1, "limit": 20, "total": 1 }   // ← duplicate
}
```

The customer list appears at **`data.customers`** *and* at the top-level
**`customers`**, and `pagination` appears at **`data.pagination`** *and* at the
top level. It is the same data, duplicated — wasted payload, and ambiguous about
which one is authoritative.

**Please return exactly one shape.** `data` should contain the customer list and
nothing else nested under a second key:

```jsonc
{
  "success": true,
  "data": [ { ...customer } ],             // ← the list, directly
  "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
}
```

This matches how the other list endpoints on this backend already behave
(`GET /api/products`, `GET /api/admin/users`), so **the inconsistency is with your
own convention**, not just with us. Please also include **`totalPages`** —
we currently compute it ourselves from `total / limit`.

> The frontend currently survives this only because `customerService.ts` has a
> defensive reader that tries `data` → `data.customers` → `customers` → `items` in
> turn. **We will delete that fallback chain once the shape is fixed.** Nothing is
> visibly broken today — this is about making it correct and consistent.

#### (b) 🔴 `state` is missing — the State column renders blank

The customers table has a **State** column
([customers/page.tsx:44](<src/app/(main)/agent/customers/page.tsx#L44>)), but the
payload contains **no `state`, `location`, or `address` field at all**. Our mapper
falls through all three aliases and lands on an empty string, so **every row's
State cell is blank.**

#### (c) `image` is missing — every avatar is the fallback

Same story: no `image` / `avatar` / `profileImage`, so every customer row shows the
placeholder avatar.

#### The full object the table needs

Your customer object today:
```jsonc
{ "_id", "email", "name", "createdAt", "phone", "ordersCount", "totalSpent", "lastOrderAt" }
```

Please add the two marked fields. Everything else already maps correctly:

| Field needed | Your current field | Status |
|---|---|---|
| `_id` | `_id` | ✅ |
| `name` | `name` | ✅ |
| **`state`** | — | 🔴 **MISSING → blank column** |
| **`image`** | — | 🔴 **MISSING → placeholder avatar** |
| `totalSpent` → Revenue | `totalSpent` | ✅ |
| `ordersCount` → Orders | `ordersCount` | ✅ |
| `phone` → Mobile | `phone` | ✅ |
| `createdAt` → Date | `createdAt` | ✅ |
| `email` | `email` | ✅ |
| `lastOrderAt` | `lastOrderAt` | ✅ |

> **Related:** the **detail** route for this same resource, `GET /api/customers/{id}`,
> **does not exist at all** — see **§1.2**. Please use the same corrected object
> shape there.

---

### 5.5 🔴 `GET /api/products/out-of-stock` — **a restocked product stays in the out-of-stock list (it now appears in BOTH lists)**

**📍 Where to see it:** **`/agent/produce-list`** *(log in as Agent)* → **Out of
Stock** tab → tick a product → click **"Back in Stock"**.

**What happens:**
- ✅ The product correctly appears in the **Active** tab. So
  `PATCH /api/products/bulk/status` **did** persist `status: "available"`, and
  `GET /api/products` correctly picks it up.
- 🔴 **But the product is ALSO still returned by `GET /api/products/out-of-stock`,
  so it remains listed in the Out of Stock tab.**

**The same product is now in both tabs at once, and the Out of Stock tab count is
too high.** It stays that way permanently — this is not a caching artefact on our
side (see below).

#### Diagnosis: the two endpoints disagree about what "out of stock" means

The fact that the product **moved into** `/api/products` proves the status write
succeeded. So the bug is isolated to the out-of-stock query:

| Endpoint | Behaviour after `status → "available"` |
|---|---|
| `GET /api/products` | ✅ **includes** the product — correct |
| `GET /api/products/out-of-stock` | 🔴 **still includes** the product — wrong |

**Almost certainly, `/api/products/out-of-stock` is not filtering on `status`.** It
looks like it filters on something else that our restock never changes — most
likely `quantity === 0` (or a separate stock/inventory field). Setting
`status: "available"` doesn't reset that number, so the product stays in the query.

**What we need — one of:**
- **(a)** Make `GET /api/products/out-of-stock` filter on **`status === "out_of_stock"`**, so it is the exact complement of `GET /api/products`. *(Preferred — one source of truth.)*
- **(b)** If "out of stock" is genuinely meant to be derived from `quantity === 0`, then tell us, because **`PATCH /api/products/bulk/status` is then the wrong API for this button entirely** — restocking would need to set a quantity, and we need to know what field and what value you expect.

Please confirm which of these two is the intended model. **Right now the two
endpoints are using two different definitions, and a product can satisfy both.**

- **Called from:** [productService.ts:482](src/services/productService.ts#L482). Note the frontend does **no filtering of its own** — it renders exactly the list you return, so this is not something we can paper over.

> **This is not a frontend caching issue.** We refetch both lists after every status
> change (`invalidateQueries` on the product lists), so the Out of Stock tab is
> showing a **fresh** response from your endpoint that still contains the product.

---

### 5.6 ⚠️ Hardcoded star rows (frontend bug, no backend work)

Three places render a fixed star row while displaying the **real** numeric rating
next to it — so the stars and the number visibly disagree (e.g. "3.2" printed
beside five gold stars).

**📍 Where to see it:**

| Page | Role | Where on the page | Always shows |
|---|---|---|---|
| **`/buyer/transporter-list/booking-transporter/[id]`** | Buyer | truck header, step 1 | 4 gold + 1 grey |
| **`/buyer/my-biddings`** | Buyer | seller row on each won bid | 5 gold |
| **`/agent/delivered/trackorder/[productId]`** | Agent | transporter call modal | 4 gold + 1 grey |

The rating data is already in the API response. **We own this fix** — listed for
completeness.

---

## §6. FRONTEND-SIDE GAPS — no backend work needed

Listed so you know these are **ours**, not yours, and so you don't build for them.
Pages given so you can confirm the behaviour if you hit it while testing.

### 6a. ✅ Fixed by us since v6.0 — nothing needed from you

| Gap | Fix | 📍 Page(s) |
|---|---|---|
| `/api/products/bulk/status` — wrong method **and** wrong body key | Now `PATCH` with `{ productIds, status }` (§1.6) | `/agent/produce-list` |
| **Product lists never refetched after a status change.** A product moved out of the source tab and never appeared in the destination one — only a full page reload fixed it | The cache "move" was writing to a query key that never matched a real query. Replaced with a proper invalidation of both lists. Also fixed the same bug in the single-row status toggle, and in single + bulk delete (stale tab counts) | `/agent/produce-list` |
| **Native browser `alert()` / `confirm()` dialogs** | Replaced with the themed confirm modal. Bulk Delete / Out-of-Stock / Back-in-Stock now confirm properly; the Customer Care alert now opens the real modal; dead `BulkActionsBar` deleted. **Zero native dialogs remain in the agent section** | `/agent/produce-list`, `/agent/new`, `/agent/packed`, `/agent/delivered` |
| **Notification dropdown overflowed narrow screens** — 7 of 9 navbars used a hardcoded `w-[500px]` panel yanked sideways by a magic `-left-[15rem]` | All 9 standardised on the responsive pattern the working navbars already used (`right-0`, `w-[92vw]`, `max-w-[420px]`) | every role's navbar |
| **The transporter dashboard rendered itself twice** (a `hidden lg:flex` block **and** a `flex lg:hidden` block) — both mounted, both fetched | Collapsed into one responsive tree, mirroring the agent dashboard | `/transporter` |
| **All 12 fake sparklines** | Commented out — we would rather show nothing than a fabricated trend line. **They come back the moment you ship §2's `trend[]`** | `/admin`, `/admin/all-users`, `/agent`, `/transporter` |
| **Admin user actions had no confirmation** and the ⋮ menu was missing **Remove** | Added Remove, spaced the menu items, and both Remove and Suspend now open a confirm modal naming the user | `/admin/all-users` |

### 6b. 🔧 Still ours to fix — listed so you don't build for them

| # | Gap | 📍 Page(s) |
|---|---|---|
| 1 | 🔴 **Checkout reads delivery address + phone from `localStorage["onboarding-data"]`, not `GET /api/profile`.** If the key is missing we `POST /api/orders` with `address: ""`, `phone: ""` | `/buyer/my-biddings` (checkout), `/buyer/transporter-list/booking-transporter/[id]` (step 2) |
| 2 | **No review-submission UI exists anywhere.** `POST /api/reviews` works and is never called — **buyers cannot leave a review at all** | *(nowhere — the form doesn't exist)* |
| 3 | **`POST /api/transactions/{id}/contact-customer-care` never called** — the modal shows static numbers instead (pairs with §4.1) | `/agent/pending`, `/agent/received`, `/transporter/pending` |
| 4 | **`POST /api/reviews/{id}/reply` never called from the buyer modal** (the Reply icon is a dead `<div>`). Works on the agent side | any page with the Reviews modal, e.g. `/buyer/sellers-list/[id]` |
| 5 | **Fleet "wishlist" heart writes to `localStorage`, not `POST /api/wishlist`** — and every fleet shares one boolean key | `/buyer/transporter-list/booking-transporter/[id]` |
| 6 | **Transporter reviews modal calls the *seller* endpoint** (`GET /api/sellers/{id}/reviews`) with a transporter id | `/buyer/transporter-list/[id]` |
| 7 | **Dead nav links** to routes that don't exist | `/admin/query`, `/admin/live-chat`, `/admin/chat`, `/buyer/chats` |
| 8 | **Tab counts wrong — only the active tab updates** | `/admin/transactions`, `/admin/fleet-payments`, both `/admin/track-orders/*` |
| 9 | **Search / year / month filters are client-side only** — they filter just the current page's 10–20 rows. **Your endpoints already accept these params**; we simply don't pass them | `/admin/new`, `/admin/rejected`, `/admin/active`, `/admin/suspended`, `/admin/removed`, both `/admin/track-orders/*`, `/transporter/negotiations` |
| 10 | **Agent + Admin notification badges are a `useState(false)` placeholder** — never wired to the API (unlike buyer/transporter, §1.1) | all `/agent/*`, all `/admin/*` |
| 11 | **Transporter negotiations search + Year/Month dropdowns are inert** — no `value`/`onChange` | `/transporter/negotiations` |

**⚠️ On 6b#1** — this is our most serious frontend bug. Flagged here because **you may
see orders arriving with empty `address` and `phone`** in the meantime; it is not a
backend fault.

**One question for you:** the **track-transporter "Amount" column is hardcoded
`"—"`** (`/admin/track-orders/track-transporter`) because the fleet-trip payload
carries no amount. *If* an amount is available on the trip, please add it —
otherwise tell us and we'll drop the column.

---

## §7. APPENDIX — how this audit was run

Every endpoint the frontend calls (≈130 across 25 service files) was probed live
and unauthenticated against `https://tractive-be.vercel.app`.

On this backend **routing resolves before auth**, which makes the status code a
reliable existence test:

| Code | Means |
|---|---|
| `401` / `403` | ✅ Route exists (auth / role required) |
| `405` | ✅ Route exists, wrong HTTP method |
| `400` | ✅ Route exists, validation rejected our params |
| `404` **with a JSON body** | ✅ Route exists — the *resource* wasn't found |
| `404` **with an HTML body** | ❌ **Route is not registered** |

That last distinction matters and is why this audit is more accurate than the
previous version. A probe with a non-existent Mongo id returns
`404 {"error":"Product not found"}` for `GET /api/products/{id}` — the route is
**fine**. A genuinely unregistered route returns the Next.js **HTML** 404 page.
We verified against a control (`/api/this/route/does/not/exist` → HTML 404) and
against a bogus leaf under a real prefix.

**All four 404s in §1 returned the HTML page.** They are genuinely missing, not
just missing a resource.

**Frontend coverage:** every page and widget in the admin, agent, buyer, and
transporter sections was walked component-by-component to determine whether it is
API-fed or hardcoded. Anything found to be working was omitted from this document
by design.
