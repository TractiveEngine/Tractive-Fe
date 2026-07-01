# BACKEND API REQUIREMENTS & OUTSTANDING WORK

**Project:** Tractive
**Document Version:** 4.1 (added live-response regressions found in testing)
**Date Issued:** 29 April 2026
**Last Updated:** 1 July 2026
**Prepared By:** Frontend Engineering Team
**Distribution:** Backend Engineering Team
**Status:** For Action

---

## 0. WHAT CHANGED IN THIS VERSION

Testing against the live backend (`https://tractive-be.vercel.app`) surfaced
**four issues on endpoints that were previously marked done or expected to work**.
Two are hard errors (a 500 and a 400), one is bad data in the response body, and
one is a payload spec the frontend still needs. These are listed first in the new
**§0.1 Live bugs** block below because they block pages that are otherwise finished
on the frontend — no frontend change will fix them; the backend has to.

Everything else in this document (from §1 onward) is unchanged outstanding work.

### 0.1 🔴 Live bugs found in testing (fix these first)

| # | What breaks | Endpoint (live) | Symptom | What the backend must do |
|---|---|---|---|---|
| **L1** | Admin → Track Orders → Agent page is empty | `GET /api/admin/orders/track/agent?status=paid&page=1&limit=20` | **HTTP 500** (server error) | Endpoint throws. Frontend is fully wired ([`adminTrackOrderService.ts`](src/services/adminTrackOrderService.ts), page at `/admin/track-orders/track-agent`). Backend must stop 500-ing and return the documented `{ data: [...], pagination }` shape for both `status=paid` and `status=delivered`. |
| **L2** | Buyer homepage banners show broken images | `GET /api/buyers/banners` → item `imageUrl: "/banners/fresh-harvest.jpg"` | Image 404s in the browser | `imageUrl` is a **root-relative path**, so the browser resolves it against the frontend origin (`localhost:3000/banners/…`) where no such file exists. Return an **absolute URL** (`https://<cdn-or-backend>/…/fresh-harvest.jpg`). |
| **L3** | Buyer booking-transporter detail page can't load a truck | `GET /api/transporters/trucks/{id}` (e.g. `…/trucks/69fb76bbe9b0c1859d580c5d`) | **HTTP 400** (bad request) | Fetching a single truck by id 400s. Frontend calls this from [`getTruckById`](src/services/transporterService.ts) via `useGetTruckById`. Backend must accept a truck `_id` and return the truck (`ApiTruck` shape), or tell us the correct route/param if `trucks/{id}` is not it. |
| **L4** | Transporter → Customers "Support" modal can't send | `POST /api/transporters/customers/{id}/chat` | Endpoint not implemented | The support modal ([`transporter/customers/_components/SupportModal.tsx`](src/app/(main)/transporter/customers/_components/SupportModal.tsx)) currently shows static contact info because there's no endpoint. See **§4.2** for the payload. |

> L1 and L3 were treated as **done/working** in v4.0. They are now confirmed
> broken against live and are effectively **regressions** — please re-check the
> route handlers.

**This document lists only what is still outstanding.** Anything not mentioned
here is done and wired.

---

## 1. EXECUTIVE SUMMARY — WHAT IS LEFT

0. **🔴 Live bugs (§0.1)** — track-agent 500 (L1), truck-by-id 400 (L3),
   banner `imageUrl` not absolute (L2), customer-chat endpoint (L4). Fix first.
1. **Two seller-payload fields** — add `isFollowing` and `ratingDistribution` to
   `getSellerById` so the follow button and rating bars show the truth on load.
2. **Transporter order-tracking branding** — include the real
   `transporter: { name, logoUrl, rating }` in trip/tracking (still hardcoded).
3. **Transporter customer chat** — `POST /api/transporters/customers/{id}/chat`
   (same as L4).
4. **Fleet statuses** — `GET /api/transporters/fleet-statuses` (states &
   bank-accounts are now live and wired — dropped from this list).
5. **Notifications live stream** — build the push/SSE endpoint; the dropdown still polls.
6. **Agent commission** — return the commission instead of the frontend hardcoding 10%.
7. **User payout bank account** — add a save/read endpoint so agents & transporters can
   persist their own bank details (the two bank-account settings pages have no endpoint;
   see §5.4).

---

## 2. MASTER INDEX — outstanding only

> **Legend:** ❌ not wired · ⚠️ field/filter gap (FE ready, needs backend field) · 🔴 live bug.

| # | Page / Component (file) | Status | API(s) needed |
|---|---|---|---|
| **🔴 LIVE BUGS (see §0.1)** | | | |
| L1 | Admin track-orders → Agent (`track-agent/page.tsx`) | 🔴 500 | fix `GET /api/admin/orders/track/agent` (returns the documented list shape) |
| L2 | Buyer homepage banners (`BuyersHeader.tsx`) | 🔴 data | `GET /api/buyers/banners` must return **absolute** `imageUrl` |
| L3 | Buyer booking-transporter (`booking-transporter/[id]/page.tsx`) | 🔴 400 | fix `GET /api/transporters/trucks/{id}` |
| L4 | Transporter customers chat (`SupportModal.tsx`) | ❌ | `POST /api/transporters/customers/{id}/chat` (same as T7) |
| **BUYER** | | | |
| B2 | Follow initial state (`StoreHeader.tsx`, `getSellerById`) | ⚠️ | add `isFollowing: boolean` to seller payload |
| B6 | Store/product rating breakdown (`StoreHeader.tsx`, `ProductInfo.tsx`) | ⚠️ | add `ratingDistribution` to `getSellerById` / reviews summary |
| **TRANSPORTER** | | | |
| T6 | Order-tracking branding (`{New,Picked,OnTransit,Delivered}OrderTracking.tsx`) | ⚠️ | include `transporter:{name,logoUrl,rating}` in trip/tracking · opt. `POST …/{tripId}/locations` |
| T7 | Customers support chat (`transporter/customers/page.tsx`) | ❌ | `POST /api/transporters/customers/{id}/chat` (= L4) |
| T11 | Fleet statuses in AddFleet (`AddFleet.tsx`) | ❌ | `GET /api/transporters/fleet-statuses` |
| **SHARED** | | | |
| S1 | Notifications live stream (`notificationService.ts`) | ⚠️ | build `GET /api/notifications/stream` (list, unread-count & per-item read already wired) |
| S4 | Fleet statuses | ❌ | `GET /api/transporters/fleet-statuses` |
| S6 | Agent commission (`transactionService.ts`) | ⚠️ | return `commission` (or a rate) instead of FE hardcoding 10% |
| S7 | User payout bank account (`{agent,transporter}-profile/…-bank-account/page.tsx`) | ❌ | add `GET`/`PATCH /api/profile/bank-account` (persist user's own bank details) |

---

## 3. BUYER

### 3.1 Follow — ⚠️ initial state field missing (action wired)

**Page / Component:** `hooks/followingContext.tsx`,
`sellers-list/_components/sellersStore/StoreHeader.tsx`,
`ProductDetails/productAndSellersInfo/SellersInfo.tsx`.
- **Done:** follow / unfollow call `POST` / `DELETE /api/buyers/sellers/{sellerId}/follow`
  live (context, store-header button, product-page seller card).
- **What's still wrong:** the seller payload (`getSellerById`) carries no follow flag, so
  the "Follow" button can't show the correct initial state on load.
- **API needed (fix existing):** add **`isFollowing: boolean`** to the `getSellerById`
  seller payload (and any seller list feeding the button).

### 3.2 Store / product rating breakdown — ⚠️ add field

**Page / Component:** `sellers-list/_components/sellersStore/StoreHeader.tsx`
(the 5★→1★ bars) and `ProductDetails/productAndSellersInfo/ProductInfo.tsx` (product stars).
- **Done:** the store-header bars and product stars render from real values
  (`averageRating`, `totalReviews`, and `ratingDistribution` when present).
- **What's still wrong:** `getSellerById` returns `averageRating` / `totalReviews` /
  `rateStatus` but **no per-star breakdown**, so the bars render empty.
- **API needed (fix existing):** add **`ratingDistribution`** to the seller payload:
  `ratingDistribution: [{ rating: 1..5, count, percentage? }]`
  *(FE computes `percentage` from `count`/`totalReviews` if omitted.)*

---

## 4. TRANSPORTER (remaining polish)

> Dashboards, order-tracking pages, customers, drivers (incl. `year`/`month` filter),
> negotiations, and reviews are **already wired**. Only the three items below remain.

### 4.1 Order tracking branding — ⚠️ include real transporter fields

**Page / Component:** `…/_components/orderTracking/{New,Picked,OnTransit,Delivered}OrderTracking.tsx`.
- **What's wrong:** every tracking sub-component (New / Picked / OnTransit / Delivered)
  renders **hardcoded branding** — the transporter name is literally
  `"GIGM Transport Company"` and the rating is a fixed 4 stars, regardless of which
  transporter is actually carrying the order. So a buyer tracking any delivery sees the
  same fake company and rating.
- **Why the FE can't fix it alone:** the trip detail / tracking responses the page
  already consumes **don't carry the transporter's identity** — there's nothing real to
  show, so the placeholder stays.
- **API needed (fix existing):** include a `transporter` object on the trip detail and
  tracking responses:
  - **Must RETURN:** `transporter: { name, logoUrl, rating }`
    (name → the header, logoUrl → the avatar, rating → the stars).
- **Optional (live map):** `POST /api/transporters/fleet-trips/{tripId}/locations` ·
  **Body:** `{ lat, lng, timestamp }` for live GPS pings on the map.

### 4.2 Customers support chat — ❌ endpoint needed (= §0.1 L4)

**Page / Component:** `transporter/customers/page.tsx` →
`transporter/customers/_components/SupportModal.tsx`.
- **What's wrong:** the modal only shows static phone/email/"Start Live Chat" text —
  there is no endpoint to actually send a message to a customer.
- **API needed:** `POST /api/transporters/customers/{id}/chat`
  - **`{id}`** = the customer's id (the row the transporter clicked "Support" on).
  - **Body:** `{ message: string, subject?: string }`
  - **Should RETURN:** the created message/thread, e.g.
    `{ id, customerId, subject, message, createdAt, status }` so the modal can
    confirm delivery.

### 4.3 Fleet statuses in AddFleet — ❌ endpoint needed (shared, see §5.2)

**Page / Component:** `transporter/_components/AddFleet.tsx`.
- **What's wrong:** the fleet-status dropdown falls back to a hardcoded list because the
  endpoint isn't confirmed live. (States is now live and wired — only fleet-statuses left.)
- **API needed:** `GET /api/transporters/fleet-statuses`.

---

## 5. SHARED

### 5.1 Notifications — ⚠️ only the live stream is left

**Service:** `services/notificationService.ts`.
- **Already wired (do not rebuild):** server-side list `GET /api/notifications` with
  `unread`/`page`/`limit`, the `unreadCount` badge (`GET /api/notifications/unread/count`),
  and **per-item read** (`PATCH /api/notifications/{id}` · `{ isRead: true }`) on click.
- **Still to build — live push:** `GET /api/notifications/stream` (SSE or WebSocket). The
  dropdown currently **polls** every 60 s. *Note:* `EventSource` can't send the `Bearer`
  header — backend must decide auth (token-in-query vs cookie).

### 5.2 Fleet statuses — ❌ only reference item left

- **Fleet statuses:** `GET /api/transporters/fleet-statuses`
  → `[{ value, label }]` for `available | under_maintenance | on_transit`.
  *(Used by Transporter `AddFleet`; the FE falls back to a hardcoded list until it's live.)*
- **Already live & wired:** Nigerian states (`GET /api/states`), bank accounts
  (`GET /api/payment/bank-accounts`), and categories (`GET /api/categories`).

### 5.3 Agent commission — ⚠️ hardcoded 10%

**Service:** `transactionService.ts` (computes `amount * 0.1` in the browser).
- **API needed:** return the `commission` on the transaction (or a config rate) so the
  10% isn't frozen in the frontend.

### 5.4 User payout bank account — ❌ no persistence endpoint

**Page / Component:** `agent-profile/agent-bank-account/page.tsx`,
`transporter-profile/transporter-bank-account/page.tsx`.
- **What's wrong:** these settings pages let an agent/transporter enter their **own**
  payout bank details (bank name, account number, account name), but there is **no
  endpoint to save or read them** — the form currently only writes to `localStorage`, so
  the data never reaches the backend and is lost on another device/refresh. (Note:
  `GET /api/payment/bank-accounts` is a *different* thing — the admin-managed accounts
  buyers pay *into* — not the user's own payout account.)
- **API needed:**
  - **`GET /api/profile/bank-account`** → the saved account, e.g.
    `{ bankName, accountNumber, accountName }` (so the form can prefill).
  - **`PATCH /api/profile/bank-account`** · **Body:** `{ bankName, accountNumber, accountName }`
    → persist/update it. *(Could also be folded into the existing `/api/profile` payload
    as a `bankAccount` object if preferred.)*
- **FE status:** the other five profile/settings pages (profile edit, delivery location,
  security/password for buyer & transporter) are now wired to `/api/profile` and
  `/api/auth/change-password`. Only these two bank pages remain, blocked on the above.

---

## 6. DELIVERY STATUS SUMMARY

| # | Module / Area | Status | Outstanding backend work |
|---|---|---|---|
| 0 | 🔴 Live bugs (§0.1) | broken | track-agent 500 (L1); banner URL not absolute (L2); truck-by-id 400 (L3); customer-chat endpoint (L4) |
| 1 | Buyer — seller payload | ⚠️ 2 fields | `isFollowing` (B2) + `ratingDistribution` (B6) on `getSellerById` |
| 2 | Transporter — order-tracking branding | ⚠️ | real `transporter:{name,logoUrl,rating}` in trip/tracking (T6) |
| 3 | Transporter — customer chat | ❌ | `POST /api/transporters/customers/{id}/chat` (T7 = L4) |
| 4 | Fleet statuses (shared) | ❌ | `GET /api/transporters/fleet-statuses` (S4) |
| 5 | Notifications (shared) | ⚠️ | build live stream `/stream` (S1) — rest wired |
| 6 | Agent commission | ⚠️ | return `commission` instead of FE 10% (S6) |

---

## 7. RECOMMENDED DELIVERY SEQUENCE

| Priority | Workstream | Why first |
|---|---|---|
| 0 | 🔴 Live bugs (§0.1): track-agent 500 · truck-by-id 400 · banner absolute URL · customer-chat | Broken/blocking on otherwise-finished pages. The two hard errors (L1, L3) are regressions. |
| 1 | Seller payload: `isFollowing` + `ratingDistribution` | Small adds; makes follow-state & rating bars truthful. |
| 2 | Transporter order-tracking branding fields | Removes the fake "GIGM" name + fixed rating from tracking. |
| 3 | Fleet statuses endpoint | Unblocks the AddFleet dropdown. |
| 4 | Agent commission field | Removes a frozen 10% from the frontend. |
| 5 | Notifications live stream (`/stream`) | Enhancement; polling still works today. |

---

## 8. POINTS OF CONTACT

| Area | Contact |
|---|---|
| Frontend Lead | _to be filled_ |
| Backend Lead | _to be filled_ |
| Product Owner | _to be filled_ |

---

*End of document.*
