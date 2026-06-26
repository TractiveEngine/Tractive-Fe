# Project Status — Tractive FE

_Running log of what's done and what's next. Pairs with `BUILD-PLAN.md` (the full phased plan) and `API-FEEDBACK-FOR-BACKEND.md` (backend asks). Update this file as tasks complete._

_Last updated: 2026-06-26 — Phase 5 cleanup done (5.1–5.4, 5.6, 5.8; 5.5 & 5.7 skipped/deferred per decision). All frontend-only work (Phases 0,1,2,5) complete. Remaining: Phase 3 (dashboards) + Phase 4 (data completeness), both backend-gated._

---

## ✅ Done

### Phase 0 — Quick wins & bug fixes
Complete (0.1–0.7). See BUILD-PLAN for details.

### Phase 1 — Security & auth correctness
Complete (1.1–1.4): server-side route protection middleware, authenticated services, centralized base URLs/secrets, reconciled permission logic.

### Phase 2 — Wire existing endpoints
- **2.1 — Agent transaction approve/reject** ✅ — Approve action + React Query (`useAgentTransactions`, `useUpdateTransactionStatus`), details modal.
- **2.2 — Agent: Track Order page** ✅
  - `getOrderById` → full `OrderRecord`; new `useOrderDetail(orderId)` query hook (TanStack, keyed by `orderKeys.detail`).
  - All 5 subcomponents wired to real data via the shared `orderToTrackOrder` mapper; fake 5s `setTimeout` removed; loading/error states added.
  - Live GPS map reused from buyer (`useOrderTracking`, 30s poll).
  - Fixed dead `/agents/...` → `/agent/...` routing on the 3 ActionMenus + back button.
  - Backend gaps logged as **Item 7b** in `API-FEEDBACK-FOR-BACKEND.md`.
- **2.4 — Agent reviews reply** ✅ — `useReviewQueries` (TanStack) + interactive reply composer; replies render under each review.
- **2.5 — Wire decorative filters** ✅ — Bids (search debounced + year/month) and Customers (`month`) now post their values; `bidService.getBids`/`getCustomers` extended; backend support requested as **Item 8**.
- **2.6 — Fleet "Track" action** ✅ — `ALLTransit` Track routes into the trip tracking view (`/transporter/on-transit?search=<IOT>`); `BookingTripsView` seeds its search from `?search=`.
- **2.7 — AddFleet status enum mapping** ✅ — `fleetStatusToApi`/`fleetStatusToLabel` in `utils/Fleet.ts`; AddFleet sends a valid status enum and shows the right label on edit.
- **2.3 — Admin track actions** — ✅ **track-transporter** (Buyer Info / Transporter Info via new `TrackTransporterInfoModal`; Track Order via reused `TripDetailsModal`; debug logs removed). ⛔ **track-agent** backend-blocked — no agent-order tracking endpoint (logged as **Item 9**).

**Phase 2 frontend work is complete. Only track-agent (2.3) remains, blocked on a backend endpoint.**

### Phase 5 — Cleanup & polish
- **5.1 — transporter received/pending** ✅ — Swapped the sidebar (desktop + mobile) onto the real-data `pending/` page and deleted the mock `received/` folder. _Note vs plan:_ `received/` (mock) was the nav-linked page while `pending/` (real `getTransactions`) was orphaned — and both render the same Pending/Approved tabbed view. Since `pending/` already exposes both tabs, removed the now-redundant "Received" nav item rather than duplicate the link. Also trimmed the dead `TransporterPendingData`/`TransporterApprovedData` mock arrays (kept the `TransporterTransaction` type + `mapTransporterTransaction`, still used by `pending/`).
- **5.2 — orphaned tracking files** ✅ — Deleted the per-page `_components` under transporter `new/picked/on-transit/delivered` (36 never-imported demo components). **Kept `TrackOrder.css`** in each — its classes are still consumed by the live `BookingTripsView`/`TripDetailsModal` (verified before deleting).
- **5.3 — misplaced files** ✅ — Deleted orphaned `transporter/_components/DriverDetailsForm.tsx` and `buyer/BiddingDatas.tsx`. `mockProductImages` confirmed already gone.
- **5.4 — agent order tables dedup** ✅ — Replaced 9 triplicated table components + 9 triplicated ActionMenus with a single shared React-Query `AgentOrderTable` (in `agent/_components/table/`) + 3 shared ActionMenus (`agent/_components/ActionMenu/`), reused across all 3 pages. Tables now read through cached `useOrders` (status-keyed, shared with the tab counts), map via `mapOrderRecord`, and the status-advance action invalidates `orderKeys.lists()` so rows + counts resync. `delivered/page.tsx`'s manual `useEffect`/`console.log`/30s-interval count fetch replaced with `useOrders`. Typechecks clean.
- **5.5 — support contact** ⏭️ — Skipped per decision (accept static placeholder).
- **5.6 — buyer error states** ✅ — Added error-state UI (message + Retry button) to buyer **Wishlist** (`isError`/`refetch` from `useGetWishlist`) and **Transactions** (`isError`/`refetch` from `useOrders`); both previously had only loading + success/empty.
- **5.7 — buyer category taxonomy + ProPaymentMethod** ⏭️ — Skipped per decision. Taxonomy backend-blocked (no categories endpoint); `ProPaymentMethod` selection deferred.
- **5.8 — pagination + rejection reason** ✅ — Admin `RemovedTable` now paginates client-side (10/page; Prev/numbered/Next; "showing X–Y of N"; resets on filter change, clamps when results shrink). `ConfirmActionModal` gained an optional reason textarea; admin approvals reject flow captures it (falls back to "Rejected by admin" when blank).

### Bug fixes (this session)
- **Agent Customers page crash** ✅ — page threw `data.map is not a function` (TableList) because `customerService.getCustomers` assumed a `{ data: Customer[], pagination }` envelope, but the backend returned a different shape, so `response.data` wasn't an array. Made `getCustomers`/`getCustomerProfile` envelope-defensive (handles `{ data: [...] }`, `{ data: { customers: [...] } }`, bare array, etc.) with a `mapToCustomer` normaliser (`_id`→`id`, `phone`→`mobile`, `totalSpent`→`revenue`, …) so the service always returns a real `Customer[]`. Added an `Array.isArray` guard in `TableList` as belt-and-suspenders for all its other uses.

---

## 🔜 Next up

All frontend-only work (Phases 0, 1, 2, 5) is complete. Remaining work is **backend-gated**: Phase 3 (dashboards — needs analytics endpoints) and Phase 4 (order data completeness). Phase 5.5 and 5.7 were intentionally skipped/deferred (static contact info; backend category taxonomy). _(Per direction: Phase 3 not being worked on yet.)_

_Repo note: `next lint` is currently non-functional in this checkout (it misreads `lint` as a directory — "no such directory: …\lint"), independent of Phase 5 changes. Type safety verified via `tsc --noEmit` (clean)._

---

## ⛔ Blocked / backend-dependent

- **Phase 3 — Dashboards** — blocked on analytics endpoints (Phase 3.0). All 4 home pages still mock. **Decision (2026-06-26):** rather than deriving dashboard metrics client-side from existing endpoints (transactions/customers/products/farmers), the team will request **dedicated dashboard analytics endpoints** from the backend. Frontend wiring is deferred until those land. (A client-side aggregation scaffold was prototyped and then removed per this decision.)
- **Phase 4 — Backend data completeness** — tracked in `API-FEEDBACK-FOR-BACKEND.md`:
  - **Item 6** — `/api/orders` populate transporter/fleet/timeline/route (buyer track page = "N/A").
  - **Item 7b** — same fields on `/api/orders/{orderId}` (agent Track Order page). _Added this session._
  - **Item 5** — confirm `/api/orders/{orderId}/tracking` shape (live map, shared buyer+agent).
  - **Item 8** — list filter params (`search`/`year`/`month`) on bids + customers. _Added this session._
  - **Item 9** — agent-order tracking endpoint (unblocks admin **track-agent**). _Added this session._
  - Items 1–4, 7 — confirmations + small additions.

---

## 🧹 Phase 5 cleanup — ✅ done
5.1–5.4, 5.6, 5.8 complete (see Done section). 5.5 skipped (static contact accepted); 5.7 deferred (category taxonomy backend-blocked; `ProPaymentMethod` selection deferred).
