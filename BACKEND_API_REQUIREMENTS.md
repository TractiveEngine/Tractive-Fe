# BACKEND API REQUIREMENTS & OUTSTANDING WORK

**Project:** Tractive
**Document Version:** 3.0 (rewritten from a full page-by-page code audit)
**Date Issued:** 29 April 2026
**Last Updated:** 26 June 2026
**Prepared By:** Frontend Engineering Team
**Distribution:** Backend Engineering Team
**Status:** For Action

---

## 0. HOW TO READ THIS DOCUMENT (PLAIN-ENGLISH GUIDE)

> **Read this first — even if you are not a developer.** It explains every technical
> word, so the rest of the document makes sense.

### 0.1 The big picture

- The **frontend** is the set of screens the user clicks on.
- The **backend** is the server where the real data lives.
- An **API** is the agreed way the two talk to each other. Each specific "question"
  the frontend can ask is called an **endpoint** (it has a web address / URL).

**The problem this document describes:** many Tractive screens are fully built and
*look* finished, but they are showing **fake, typed-in data** ("hardcoded" /
"fixture" data) instead of real data from the database. To make them real, the
backend must **build the missing endpoints** or **fix existing ones** so they accept
the search/filter instructions the screen sends.

### 0.2 Key words

| Term | Plain meaning | Analogy |
|---|---|---|
| **Endpoint** | One specific question the frontend asks the backend. | A phone extension for one department. |
| **GET** | Read / fetch data (changes nothing). | "What's on the menu?" |
| **POST** | Create something new. | Submitting a new form. |
| **PATCH** | Update part of something that exists. | Editing one line on a form. |
| **Path parameter** `{id}` | An ID placed inside the address. | The file number on a folder. |
| **Query parameter** ("query part") | Instructions added after `?` to **filter, search, sort, or page**. | "Books — but only sci-fi, after 2020, page 2." |
| **Request body** | Data sent along with a POST/PATCH. | The contents of the form you hand in. |
| **Response** | The answer sent back (as JSON fields). | The filled-in answer sheet. |
| **Pagination** | Returning data in pages (e.g. 20 rows) instead of all at once. | "Page 1, 2, 3…" |
| **Hardcoded / fixture / stub** | **Fake placeholder data typed into the code** because the real endpoint doesn't exist yet. | A cardboard cut-out of a product. |
| **Wired** | The screen is correctly connected to a real endpoint. | The phone line actually works. |

### 0.3 How each item below is written

Every page/component is written in this shape so you always know what to build:

> **Page / Component:** which screen or piece of code (with file path)
> **Status:** ❌ Not wired · ⚠️ Partly wired / filter gap · ✅ Wired (FYI)
> **What's wrong:** what is fake or missing, in plain words
> **API needed:** the method + address to build (or fix)
> **Must ACCEPT:** the query parts or request body the backend should read
> **Must RETURN:** the exact fields the screen needs back

---

## 1. EXECUTIVE SUMMARY — WHAT IS LEFT TO DO

After auditing all four roles page-by-page, the outstanding API work falls into
five buckets:

1. **Dashboards are 100% fake.** Every dashboard widget for Admin, Agent, and
   Transporter shows typed-in numbers. **~16 analytics endpoints** are needed.
2. **Admin Approvals & Admin Track-Orders don't work.** Buttons only print to the
   console; lists come from fixtures. **New list + action endpoints** are needed.
3. **Filters/search that don't reach the backend ("query-part gaps").** Several
   screens have working-looking filter dropdowns and search boxes that the backend
   ignores (Admin users, Admin approvals, Agent customers, Transporter drivers,
   Notifications). See the quick-reference in **Section 8**.
4. **Hardcoded reference data & payment details.** Categories, Nigerian states,
   fleet statuses, banner images, and — most importantly — **buyer bank account
   numbers** are typed into the code. These need small "lookup" endpoints.
5. **Notifications are incomplete.** No per-item "mark as read", no server-side
   unread filter, and the dropdown polls instead of receiving a live stream.

**Good news (already wired — do NOT rebuild):** Buyer flows are ~95% wired; the
Transporter **order-tracking** pages, **customers** page, **fleet/driver** CRUD,
**negotiations**, and **reviews** are already connected to live endpoints. Where
those need only a backend tweak (e.g. honouring a filter), it is noted as ⚠️.

---

## 2. SCOPE & EXISTING CONTRACTS

### 2.1 Out of Scope
- UI/UX redesign · frontend-only refactors · authentication overhaul
  (`/api/profile` login is sufficient).

### 2.2 Already-wired services (the agreed contract)
The frontend already has the calling code for these services; only **additions or
fixes** to them are requested below:
`adminUserService`, `bidService`, `customerService`, `driverService`,
`FarmerService`, `fleetService`, `fleetTripService`, `negotiationService`,
`notificationService`, `OrderService` (`OrdersApiService`), `productService`,
`reviewService`, `transactionService`, `transporterService`, `UserService`.

### 2.3 Master index — every page and the API it needs

> One-line-per-page roll-up of Sections 3–7. **Legend:** ❌ not wired · ⚠️ filter/field gap · ✅ wired (tweak only).
> Query-part gaps (filters/search the backend ignores) are collected separately in **Section 8**.

| # | Page / Component (file) | Status | API(s) needed |
|---|---|---|---|
| **ADMIN** | | | |
| A1 | Dashboard stat cards (`AdminOverview.tsx`) | ❌ | `GET /api/admin/dashboard/overview` |
| A2 | Revenue chart (`AdminRevenueChart.tsx`) | ❌ | `GET /api/admin/dashboard/revenue` |
| A3 | Top agents (`TopAgents.tsx`) | ❌ | `GET /api/admin/dashboard/top-agents` |
| A4 | Top buyers (`TopBuyer.tsx`) | ❌ | `GET /api/admin/dashboard/top-buyers` |
| A5 | Top transporters (`TopTransporter.tsx`) | ❌ | `GET /api/admin/dashboard/top-transporters` |
| A6 | Approvals New/Declined (`ApprovalsAgents.tsx`, `ApprovalTransporters.tsx`, `admin/declined`) | ❌ | `GET /api/admin/approvals` · `POST /api/admin/approvals/{id}/approve` · `POST /api/admin/approvals/{id}/decline` |
| A7 | Track-orders — agent (`track-agent/page.tsx`) | ❌ | `GET /api/admin/orders/track/agent` |
| A8 | Track-orders — transporter (`track-transporter/page.tsx`) | ❌ | `GET /api/admin/orders/track/transporter` |
| A9 | Track-orders detail popups (`TrackTransporterActionMenu.tsx`) | ❌ | `GET /api/admin/orders/{orderId}/{buyer-info\|seller-info\|transporter-info\|tracking}` |
| A10 | All-users filters (`AllUserType.tsx`) | ⚠️ | `GET /api/admin/users` + `state`, `month`, `year` |
| A11 | Removed-users paging (`admin/removed/page.tsx`) | ⚠️ | `GET /api/admin/users?status=removed` honour `page`/`limit` (mostly FE) |
| **AGENT** | | | |
| G1 | Dashboard overview (`FarmerOverview.tsx`) | ❌ | `GET /api/agents/dashboard/overview` |
| G2 | Revenue chart (`FarmerRevenueChart.tsx`) | ❌ | `GET /api/agents/dashboard/revenue` |
| G3 | Top customers (`TopCustomers.tsx`) | ❌ | `GET /api/agents/dashboard/top-customers` |
| G4 | Out of stock (`OutOfStock.tsx`) | ❌ | `GET /api/agents/dashboard/out-of-stock` · `POST /api/agents/products/{productId}/restock` |
| G5 | Most-sold items (`MostSoldItem.tsx`) | ❌ | `GET /api/agents/dashboard/most-sold-items` |
| G6 | Most-sold categories (`MostSoldCategoryPieChart.tsx`) | ❌ | `GET /api/agents/dashboard/most-sold-categories` |
| G7 | Reviews (`agent/reviews/page.tsx`) | ⚠️ | `GET /api/reviews/summary` · `GET /api/agents/me` |
| G8 | Customers (`agent/customers/page.tsx`) | ⚠️ | `GET /api/customers` + `search`/`location`/`state`/`year`/`month` |
| G9 | Order tracking (`delivered/trackorder/[productId]`) | ❌ | `GET /api/agents/orders/{orderId}` · `GET /api/agents/orders/{orderId}/tracking` |
| G10 | Add-to-store categories (`AddToStore.tsx`) | ❌ | `GET /api/categories?withSubcategories=true` (§7.2) |
| G11 | Bids filters (`agent/bids`, `bidService.ts`) | ⚠️ | `GET /api/bids` + `search`/`year`/`month` |
| **BUYER** | | | |
| B1 | 🔴 Bank accounts (`BankAccounts.tsx` ×2) | ❌ | `GET /api/payment/bank-accounts` · `POST /api/payments/{paymentRef}/confirm` |
| B2 | Follow/unfollow sellers (`followingContext.tsx`) | ❌ | `POST` / `DELETE /api/buyers/sellers/{sellerId}/follow` |
| B3 | Homepage banners (`BuyersHeader.tsx`) | ❌ | `GET /api/buyers/banners` |
| B4 | Category/interest filters (`FilterProduct.tsx`, `BuyersHeader.tsx`) | ❌ | `GET /api/categories?withSubcategories=true` (§7.2) |
| B5 | Transporter card badge/count (`TransporterCard.tsx`) | ⚠️ | `GET /api/transporters` + `coverageStates`, `customersCount` |
| **TRANSPORTER** | | | |
| T1 | Dashboard overview (`TransporterOverview.tsx`) | ❌ | `GET /api/transporters/dashboard/overview` |
| T2 | Revenue chart (`TransporterRevenueChart.tsx`) | ❌ | `GET /api/transporters/dashboard/revenue` |
| T3 | Most hired (`MostHired.tsx`) | ❌ | `GET /api/transporters/dashboard/most-hired-drivers` |
| T4 | Top customers (`TopCustomers.tsx`) | ❌ | `GET /api/transporters/dashboard/top-customers` |
| T5 | Transit table (`TransitTable.tsx`) | ⚠️ | `GET /api/transporters/dashboard/transit` (or reuse fleet-trips) |
| T6 | Order tracking branding (`{New,Picked,OnTransit,Delivered}OrderTracking.tsx`) | ✅⚠️ | include `transporter:{name,logoUrl,rating}` in trip/tracking · opt. `POST …/{tripId}/locations` |
| T7 | Customers (`transporter/customers/page.tsx`) | ✅⚠️ | confirm `search`/`year`/`month` server-side · `POST …/customers/{id}/chat` |
| T8 | Drivers (`transporter/drivers/page.tsx`) | ⚠️ | `GET /api/transporters/drivers` + `year`/`month` |
| T9 | Received counts (`transporter/received/page.tsx`) | ⚠️ | wire `GET /api/transporters/transactions` (FE fix) |
| T10 | Negotiations search (`transporter/negotiations/page.tsx`) | ✅⚠️ | confirm `GET /api/negotiations?search=` (FE wires input) |
| T11 | Form reference data (`AddFleet.tsx`, `DriverDetailsForm.tsx`) | ❌ | `GET /api/states` · `GET /api/transporters/fleet-statuses` (§7.2) |
| **SHARED** | | | |
| S1 | Notifications (`notificationService.ts`) | ⚠️ | `PATCH /api/notifications/{id}` · `GET /api/notifications` (`unread`/`page`/`limit`) · `GET /api/notifications/unread/count` · `GET /api/notifications/stream` |
| S2 | Categories | ❌ | `GET /api/categories?withSubcategories=true` |
| S3 | Nigerian states | ❌ | `GET /api/states` |
| S4 | Fleet statuses | ❌ | `GET /api/transporters/fleet-statuses` |
| S5 | Bank accounts | ❌ | `GET /api/payment/bank-accounts` |

---

## 3. ADMIN MODULE

### 3.1 Dashboard — ❌ entirely fake (5 endpoints needed)

**Page / Component:** `admin/page.tsx` and its widgets in `admin/_components/`.

---

**Stat cards** — `AdminOverview.tsx`
- **Status:** ❌ Not wired — shows `$25,550,000`, `250`, `35`, `550` and `+25%` typed in.
- **API needed:** `GET /api/admin/dashboard/overview`
- **Must RETURN:** four blocks, each a value + change %:
  `{ users: { value, deltaPercent }, payments: {…}, orders: {…}, visitors: {…} }`

**Revenue chart** — `AdminRevenueChart.tsx`
- **Status:** ❌ Not wired — 12 months of fake values + fixed Y-axis.
- **API needed:** `GET /api/admin/dashboard/revenue`
- **Must ACCEPT:** `period=month|year`, `from`, `to` (date range).
- **Must RETURN:** `{ data: [{ date, value }] }`

**Top agents** — `TopAgents.tsx`
- **Status:** ❌ Not wired — 5 fake names, all `$50,000` / `120` orders.
- **API needed:** `GET /api/admin/dashboard/top-agents`  · **Accept:** `limit` (default 5)
- **Must RETURN:** `[{ id, name, image, location, revenue, orders }]`

**Top buyers** — `TopBuyer.tsx`
- **Status:** ❌ Not wired — 7 identical "Joseph Oyin" / `$40,000`.
- **API needed:** `GET /api/admin/dashboard/top-buyers` · **Accept:** `limit` (default 7)
- **Must RETURN:** `[{ id, name, image, totalSpent }]`

**Top transporters** — `TopTransporter.tsx`
- **Status:** ❌ Not wired — 5 fake names, all `$50,000` / `120` bookings.
- **API needed:** `GET /api/admin/dashboard/top-transporters` · **Accept:** `limit` (default 5)
- **Must RETURN:** `[{ id, name, image, location, revenue, bookings }]`

### 3.2 Approvals (New / Declined) — ❌ non-functional workflow

**Page / Component:** `admin/new/_components/ApprovalsAgents.tsx`,
`ApprovalTransporters.tsx`; `admin/declined/page.tsx`.
- **What's wrong:**
  - Lists come from the `@/utils/Approvals` fixture; "Declined" is just a copy of "New".
  - Approve / Decline buttons only `console.log` — **nothing is saved**.
  - Year / Month / State filters are **client-side only** (explicit code comment:
    *"backend doesn't accept these yet"*).
- **API needed (list):** `GET /api/admin/approvals`
  - **Must ACCEPT:** `type=agent|farmer|transporter`, `status=pending|approved|declined`,
    `search`, `page`, `limit`, `year`, `month`, `state`.
  - **Must RETURN:** `{ data: ApprovalApplication[], pagination: { total } }`
  - *(The `status` filter is what makes "New" vs "Declined" stop being duplicates.)*
- **API needed (approve):** `POST /api/admin/approvals/{id}/approve` · **Body:** `{ note?: string }`
- **API needed (decline):** `POST /api/admin/approvals/{id}/decline` · **Body:** `{ reason: string }`

### 3.3 Track Orders — ❌ fixture-based, buttons stubbed

**Page / Component:** `admin/track-orders/track-agent/page.tsx` (loads the
`TrackAgentData` fixture from `src/utils/TrackAgentData.ts`),
`track-transporter/page.tsx`, and `TrackTransporterActionMenu.tsx`.
- **What's wrong:** No API call at all; buyer-info / seller-info buttons only `console.log`.
- **API needed (agent track list):** `GET /api/admin/orders/track/agent`
  - **Accept:** `status=paid|delivered`, `page`, `limit`, `search`, `year`, `month`
  - **Return:** `[{ id, image, title, description, buyerName, sellerName, amount, date }]`
- **API needed (transporter track list):** `GET /api/admin/orders/track/transporter`
  - **Accept:** `status=picked|on_transit|delivered`, `page`, `limit`
- **API needed (detail popups):**
  - `GET /api/admin/orders/{orderId}/buyer-info`
  - `GET /api/admin/orders/{orderId}/seller-info`
  - `GET /api/admin/orders/{orderId}/transporter-info`
  - `GET /api/admin/orders/{orderId}/tracking`

### 3.4 All-Users filters — ⚠️ filter gap (endpoint exists)

**Page / Component:** `admin/all-users/_components/userType/AllUserType.tsx`
(code comment confirms *"backend doesn't accept these yet"*).
- **What's wrong:** State / Month / Year dropdowns filter only the rows already on
  screen; the backend ignores them.
- **API needed (fix existing):** `GET /api/admin/users`
  - **Must ALSO ACCEPT & filter server-side:** `state`, `month`, `year`
    (alongside the existing `status`, `search`, `page`, `limit`).

### 3.5 Removed Users pagination — ⚠️ small fix

**Page / Component:** `admin/removed/page.tsx` and the Removed tab in `admin/active/page.tsx`.
- **What's wrong:** Calls `getRemovedUsers({ limit: 100 })` with a hardcoded limit,
  ignoring the user's page-size choice (inconsistent with sibling pages).
- **API needed (already exists):** `GET /api/admin/users?status=removed` must honour
  `page` & `limit` — frontend will stop hardcoding `100`. (Mostly a frontend fix; noted for awareness.)

### 3.6 Minor cleanup (no backend action)
- `admin/transactions/page.tsx:144`, `TransactionDetailModal.tsx:81` — stray `console.log`.
- `RefundedActionMenu.tsx` links to `/admin/chat`, which is not a real page (frontend to fix).
- *(Note: the Transactions Method/From/To filters ARE correctly wired to the backend — no change needed.)*

---

## 4. AGENT MODULE  *(internally called "Farmer" in some files)*

### 4.1 Dashboard — ❌ entirely fake (6 endpoints needed)

**Page / Component:** `agent/page.tsx` + widgets in `agent/_components/`.

| Widget (file) | Status | API needed | Must RETURN |
|---|---|---|---|
| `FarmerOverview.tsx` | ❌ `₦25,550,000 / 250 / 35 / 550`, all `+25%` | `GET /api/agents/dashboard/overview` | `{ revenue, orders, customers, products, deltas }` |
| `FarmerRevenueChart.tsx` | ❌ 12 fake months | `GET /api/agents/dashboard/revenue` (accept `from`,`to`,`granularity`) | `{ data: [{ date, value }] }` |
| `TopCustomers.tsx` | ❌ 5 fake customers | `GET /api/agents/dashboard/top-customers` (accept `limit`) | `[{ id, name, image, location, ordersCount, revenue }]` |
| `OutOfStock.tsx` | ❌ 7 fake products; "Restock" & "See all" buttons have no handler | `GET /api/agents/dashboard/out-of-stock` (accept `limit`) | `[{ id, name, description, image }]` |
| `MostSoldItem.tsx` | ❌ 4 fake products | `GET /api/agents/dashboard/most-sold-items` (accept `limit`) | `[{ productId, name, image, quantitySold, revenue }]` |
| `MostSoldCategoryPieChart.tsx` | ❌ fixed slice values | `GET /api/agents/dashboard/most-sold-categories` | `[{ category, percentage, value }]` |

> The **Restock** button (`OutOfStock.tsx`) also needs an action endpoint:
> `POST /api/agents/products/{productId}/restock` · **Body:** `{ quantity, restockDate }`.

### 4.2 Reviews — ⚠️ identity + client-side aggregation

**Page / Component:** `agent/reviews/page.tsx`, `services/reviewService.ts`.
- **What's wrong:**
  - The page identifies the agent with the literal `"default-agent-id"` instead of the
    logged-in agent. The reviews call sends **no agent context**.
  - The rating summary is computed **in the browser** after fetching up to 1000 reviews.
  - There is **no UI for replies** even though a `reply` endpoint exists.
- **API needed (summary):** `GET /api/reviews/summary`
  - **Must ACCEPT:** `agentId` (or infer the agent from the auth token — preferred).
  - **Must RETURN:** `{ overallRating, totalReviews, ratingDistribution: [{ rating, count, percentage }], recentReviewers: [{ id, name, avatar }] }`
- **API needed (session):** `GET /api/agents/me` → `{ id, name, email, … }`
  (may simply wrap `/api/profile`; lets Reviews stop using `"default-agent-id"`).

### 4.3 Customers — ⚠️ filter gap

**Page / Component:** `agent/customers/page.tsx`, `services/customerService.ts`
(code comment: *"Backend support pending"* for the `month` filter).
- **What's wrong:** The page shows a search box + location/date filters, but the
  backend may not honour `search` / `location` / `month` server-side.
- **API needed (fix existing):** `GET /api/customers`
  - **Must ACCEPT & filter server-side:** `search`, `location`, `state`, `year`,
    `month`, `page`, `limit`.
  - **Must RETURN:** paginated customers `{ data: [...], pagination: { total } }`.

### 4.4 Order tracking — ❌ fixture + fake loader

**Page / Component:** `agent/delivered/trackorder/[productId]/page.tsx` and its
sub-components (`OrderTrackingAndTransportInfo.tsx`, `TransportInfoAndPackageProduct.tsx`,
`MapTrackingTimeline.tsx`, `PackagedTable.tsx`).
- **What's wrong:** Renders the `DeliveredProductData` fixture behind a fake 5-second
  `setTimeout`; buyer / transporter / route data are all hardcoded.
- **API needed (order detail):** `GET /api/agents/orders/{orderId}`
  - **Must RETURN:** full order — buyer profile (name, address, phone), seller,
    product list, transporter assignment, current step, IOT, plate number, route.
- **API needed (tracking):** `GET /api/agents/orders/{orderId}/tracking`
  - **Must RETURN:** `{ pickedAt, onTransitAt, deliveredAt, fromState, toState, mapMarkers }`

### 4.5 Catalog "Add to Store" categories — ❌ hardcoded (shared, see §7.2)

**Page / Component:** `agent/_components/AddToStore.tsx` — category list typed in.
- **API needed:** `GET /api/categories?withSubcategories=true` (see §7.2).

### 4.6 Notes
- `services/bidService.ts` forwards `search/year/month` but backend support is
  *pending* — please confirm `GET /api/bids` honours these query parts.
- `transactionService.ts` computes commission as a hardcoded **10%** in the browser
  (`amount * 0.1`). Backend should return the commission (or a config value) so the
  rate isn't frozen in the frontend.

---

## 5. BUYER MODULE  *(best-wired role — ~95% done)*

> Already wired (no action): home, sellers list, product detail, transporter list,
> my-orders, wish-list, my-biddings (bids tabs), order/fleet payment & counter-offers.

### 5.1 🔴 Hardcoded bank accounts — payment-routing risk (highest priority)

**Page / Component:**
`buyer/my-biddings/_components/BankAccounts.tsx` and
`buyer/transporter-list/_components/BookingTransport/BookingHeader/BankAccounts.tsx`.
- **What's wrong:** Every bank account number is hardcoded (all show `"1218509781"`)
  and the owner name is hardcoded `"Agrictech.com.ng"`. If a real bank detail
  changes, buyers could pay into the wrong/old account.
- **API needed:** `GET /api/payment/bank-accounts`
  - **Must RETURN:** `[{ id, bank, accountName, accountNumber, logoUrl, sortOrder }]`
- **API needed (manual transfer confirmation):** `POST /api/payments/{paymentRef}/confirm`
  - **Body:** `{ bankUsed, narration?, screenshotUrl? }`

### 5.2 Follow / Unfollow sellers — ❌ no real call

**Page / Component:** `hooks/followingContext.tsx`, seeded by `buyer/layout.tsx`.
- **What's wrong:** `toggleFollow` only waits a fake 500 ms `setTimeout` and flips
  local state — it never calls the backend. The provider is also seeded with
  hardcoded names instead of `userService.getTopSellers()`.
- **API needed:**
  - `POST /api/buyers/sellers/{sellerId}/follow`
  - `DELETE /api/buyers/sellers/{sellerId}/follow`
  - **Return:** `{ isFollowing: boolean }`

### 5.3 Homepage banners — ❌ hardcoded images

**Page / Component:** `buyer/_components/BuyerHome/header/BuyersHeader.tsx`.
- **What's wrong:** Slider images are literal paths (`/images/buyer1.png` …).
- **API needed:** `GET /api/buyers/banners`
  - **Return:** `[{ id, imageUrl, link, alt, position }]`

### 5.4 Category / interest filters — ❌ hardcoded (shared, see §7.2)

**Page / Component:** `buyer/sellers-list/_components/sellersStore/FilterProduct.tsx`
(hardcoded `interests`) and `BuyersHeader.tsx` (hardcoded categories + every category
shows the *same* wrong subcategories).
- **API needed:** `GET /api/categories?withSubcategories=true` (see §7.2).

### 5.5 Transporter card "All States" badge — ⚠️ add fields

**Page / Component:** `buyer/transporter-list/_components/TransporterCard.tsx` (badge
hardcoded to `"All States"`); empty `onClick={() => {}}` on `TransporterCard.tsx` and
`SellerCard.tsx`.
- **API needed (fix existing):** `GET /api/transporters` must include
  `coverageStates: string[]` and `customersCount: number` so the card shows the truth.

---

## 6. TRANSPORTER MODULE

> **Correction to earlier drafts:** the four order-tracking pages and the customers
> page are **already wired** through `fleetTripService` / `transporterService`. The
> remaining work here is mostly **dashboards**, a few **filter gaps**, and **hardcoded
> branding** inside tracking sub-components.

### 6.1 Dashboard — ❌ entirely fake (5 endpoints needed)

**Page / Component:** `transporter/page.tsx` + widgets in `transporter/_components/`.

| Widget (file) | Status | API needed | Must RETURN |
|---|---|---|---|
| `TransporterOverview.tsx` | ❌ `₦25,550,000 / 250 / 35 / 550`, `+25%` | `GET /api/transporters/dashboard/overview` | `{ revenue, bookings/customers, fleets, drivers, deltas }` |
| `TransporterRevenueChart.tsx` | ❌ 12 fake months | `GET /api/transporters/dashboard/revenue` (accept `from`,`to`) | `{ data: [{ date, value }] }` |
| `MostHired.tsx` | ❌ 7 identical fake items | `GET /api/transporters/dashboard/most-hired-drivers` (accept `limit`) | `[{ id, name, image, hires, rating }]` |
| `TopCustomers.tsx` | ❌ 5 fake customers | `GET /api/transporters/dashboard/top-customers` (accept `limit`) | `[{ id, name, image, location, orders }]` |
| `TransitTable.tsx` | ⚠️ fake data, but a real `fleet-trips?status=on_transit` source already exists | `GET /api/transporters/dashboard/transit` (or reuse fleet-trips) | `[{ id, fleet:{name,iot}, route, driver, description }]` |

### 6.2 Order tracking (New / Picked / On-Transit / Delivered) — ✅ wired, ⚠️ branding

**Page / Component:** the four pages render `BookingTripsView.tsx`; the visible
sub-components live in `…/_components/orderTracking/{New,Picked,OnTransit,Delivered}OrderTracking.tsx`.
- **Already wired (no rebuild):** list = `GET /api/transporters/fleet-trips?status=…`;
  detail = `…/{tripId}`; tracking = `…/{tripId}/tracking` (polls every 5 min);
  status update = `PATCH /api/transporters/fleet-trips/{tripId}/status`. The
  "Mark as Picked / On Transit / Delivered" buttons correctly call this PATCH.
- **What's still wrong:** the tracking sub-components show **hardcoded branding** —
  transporter name `"GIGM Transport Company"` and a fixed 4-star rating.
- **API needed:** ensure the trip detail / tracking responses include the real
  `transporter: { name, logoUrl, rating }` so these stop being hardcoded.
- **Optional:** `POST /api/transporters/fleet-trips/{tripId}/locations` · **Body:**
  `{ lat, lng, timestamp }` for live GPS pings on the map.

### 6.3 Customers — ✅ wired, ⚠️ confirm filters

**Page / Component:** `transporter/customers/page.tsx`.
- **Already wired:** `GET /api/transporters/customers` and `…/customers/{id}`.
- **What's wrong:** please confirm the list endpoint filters **server-side** on
  `search`, `year`, `month` (UI sends them).
- **Support modal action needed:** `POST /api/transporters/customers/{id}/chat` ·
  **Body:** `{ message, subject }`.
- **Note:** the params interface types `month` as a string; should be a number.

### 6.4 Drivers — ⚠️ filter gap

**Page / Component:** `transporter/drivers/page.tsx`.
- **Already wired:** list + create/update/delete + assign-fleet.
- **What's wrong:** the Year / Month dropdowns are **not sent** to the API.
- **API needed (fix existing):** `GET /api/transporters/drivers` must accept & filter
  on `year`, `month` (plus existing `search`).

### 6.5 Received transactions count — ⚠️ hardcoded

**Page / Component:** `transporter/received/page.tsx` (lines 81, 101).
- **What's wrong:** the Pending/Approved count badges are hardcoded `15`, while the
  sibling `pending/page.tsx` fetches real counts.
- **API needed (already exists):** `GET /api/transporters/transactions` — wire
  `received` to it the same way `pending` does (frontend fix; counts come from the API).

### 6.6 Negotiations search — ⚠️ input not wired

**Page / Component:** `transporter/negotiations/page.tsx`.
- **Already wired:** list + accept/reject (`respondToNegotiation`).
- **What's wrong:** the search box has no `value`/`onChange`, so it never filters.
- **API needed:** confirm `GET /api/negotiations?search=` is supported (frontend will wire the input).

### 6.7 Reference data in forms — ❌ hardcoded (shared, see §7.2)

**Page / Component:** `AddFleet.tsx`, `DriverDetailsForm.tsx` (hardcoded
`nigerianStates`); `fleet-list/_components/ALLTransit.tsx:158` (`// TODO: tracking`,
uses `window.confirm`/`alert` instead of toast).
- **API needed:** `GET /api/states` and `GET /api/transporters/fleet-statuses` (see §7.2).

### 6.8 Reviews — ✅ fully wired (no action)

`transporter/reviews/page.tsx` is connected to `GET /api/transporters/reviews`.

---

## 7. CROSS-CUTTING (SHARED) REQUIREMENTS

### 7.1 Notifications — ⚠️ incomplete

**Service:** `services/notificationService.ts` (only `markAllRead` exists today).
- **Per-item read:** `PATCH /api/notifications/{id}` · **Body:** `{ isRead: true }`
  (today only "mark all" is possible).
- **Server-side list:** `GET /api/notifications` · **Accept:** `unread=true`, `page`,
  `limit` (today filtering/paging happens in the browser).
- **Unread badge:** `GET /api/notifications/unread/count` → `{ count }`.
- **Live push:** `GET /api/notifications/stream` (SSE or WebSocket) — the dropdown
  currently **polls**, which is heavier and slower than a live stream.

### 7.2 Shared reference data — ❌ hardcoded in many places

> Each missing list forces several components to hardcode the same values (and they've
> already drifted — e.g. "legumes" vs "Legumes", every category showing the same
> subcategories). One endpoint each fixes them all.

- **Categories:** `GET /api/categories?withSubcategories=true`
  → `[{ id, name, subcategories: [{ id, name }] }]`
  *(used by Agent `AddToStore`, Buyer `BuyersHeader` + `FilterProduct`.)*
- **Nigerian states:** `GET /api/states` → `[{ code, name }]` (optionally with LGAs)
  *(used by Transporter `AddFleet`/`DriverDetailsForm`, Admin filters.)*
- **Fleet statuses:** `GET /api/transporters/fleet-statuses`
  → `[{ value, label }]` for `available | under_maintenance | on_transit`.
- **Bank accounts:** `GET /api/payment/bank-accounts` (also §5.1) — admin-managed.
- **(Nice to have) payment methods & status enums** are also hardcoded across
  services; optional `GET /api/reference/*` endpoints would remove the drift.

### 7.3 Frontend cleanup (no backend action — listed for awareness)

Debug `console.log` statements to be removed by the frontend team before release:
`productService.ts` (~30+ logs), `UserService.ts`, `FarmerService.ts`,
`customerService.ts`, `reviewService.ts`, `admin/transactions/page.tsx:144`,
`TransactionDetailModal.tsx:81`, `TrackTransporterActionMenu.tsx`,
`FarmerActionMenu.tsx:111`, `DriverDetailsForm.tsx:153`,
`transporter/negotiations/page.tsx:210`, `buyer/.../BidsCheckout.tsx:126`.

---

## 8. "QUERY PARTS" QUICK REFERENCE (filters/search that don't reach the backend)

> These are usually the **cheapest fixes with the biggest "it finally works" payoff** —
> the controls already exist on screen; the backend just needs to read them.

| Endpoint (fix or build) | Missing query parts | What the user sees today |
|---|---|---|
| `GET /api/admin/users` | `state`, `month`, `year` | Admin filters only re-sort the current page. |
| `GET /api/admin/approvals` | `type`, `status`, `search`, `page`, `limit`, `year`, `month`, `state` | "New" & "Declined" show the same data; no filtering. |
| `GET /api/customers` (agent) | `search`, `location`, `month` | Agent search box / filters have no effect. |
| `GET /api/transporters/customers` | confirm `search`, `year`, `month` server-side | Filters may silently do nothing. |
| `GET /api/transporters/drivers` | `year`, `month` | Driver date filters not sent at all. |
| `GET /api/bids` (agent) | `search`, `year`, `month` | Bid filters pending backend support. |
| `GET /api/notifications` | `unread`, `page`, `limit` | Unread filter & paging done in the browser. |

---

## 9. DELIVERY STATUS SUMMARY

| # | Module / Area | Wired today | Outstanding backend work |
|---|---|---|---|
| 1 | Admin — Dashboard | 0 / 5 widgets | overview, revenue, top-agents/-buyers/-transporters |
| 2 | Admin — Approvals | ❌ 0% | approvals list (+`status` filter), approve, decline |
| 3 | Admin — Track Orders | ❌ 0% | track/agent, track/transporter, 4 info endpoints |
| 4 | Admin — Users / Transactions | ~85% | server-side `state`/`month`/`year` on `/api/admin/users` |
| 5 | Agent — Dashboard | 0 / 6 widgets | overview, revenue, top-customers, most-sold ×2, out-of-stock |
| 6 | Agent — Reviews / Customers / Orders | ~85% | reviews summary, `agents/me`, order tracking, customer filters |
| 7 | Buyer — All flows | ~95% | bank-accounts 🔴, follow API, banners, categories, coverageStates |
| 8 | Transporter — Dashboard | 0 / 5 widgets | overview, revenue, most-hired, top-customers, transit |
| 9 | Transporter — Order tracking | ✅ wired | include real transporter branding in trip/tracking response |
| 10 | Transporter — Customers / Drivers / Negotiations | ✅ wired | confirm server-side filters; chat endpoint; drivers `year/month` |
| 11 | Notifications (shared) | ~80% | per-item read, unread filter+count, live stream |
| 12 | Reference data (shared) | ❌ hardcoded | categories, states, fleet-statuses, bank-accounts |

---

## 10. RECOMMENDED DELIVERY SEQUENCE

| Priority | Workstream | Why first |
|---|---|---|
| 1 | 🔴 Buyer bank accounts (`/api/payment/bank-accounts`) | Real money-routing risk. |
| 2 | Dashboard analytics (all 3 roles) | Largest visible gap; high stakeholder visibility. |
| 3 | Admin approvals (list + approve + decline) | Workflow saves nothing today. |
| 4 | Query-part fixes (Section 8) | Cheap; makes existing screens actually filter. |
| 5 | Agent reviews summary + `agents/me` | Quick wins; removes `"default-agent-id"`. |
| 6 | Shared reference data (categories/states/statuses) | One endpoint each unblocks many components. |
| 7 | Admin track-orders + agent order tracking | Needs product input on what data to expose. |
| 8 | Transporter branding fields + chat + GPS pings | Polish on already-wired pages. |
| 9 | Notifications (per-item read, unread, stream) | Enhancement; current "mark all" still works. |

---

## 11. POINTS OF CONTACT

| Area | Contact |
|---|---|
| Frontend Lead | _to be filled_ |
| Backend Lead | _to be filled_ |
| Product Owner | _to be filled_ |

---

## 12. APPROVAL

| Role | Name | Signature | Date |
|---|---|---|---|
| Frontend Lead |  |  |  |
| Backend Lead |  |  |  |
| Product Owner |  |  |  |

---

*End of document.*
