# Backend TODO — work the frontend is waiting on

Hand-off list for the backend developer. Each item is **wired on the frontend already** — once the backend side is done, it works with **no further frontend change** (unless noted). Full context for each lives in `API-FEEDBACK-FOR-BACKEND.md` (referenced by item number).

**Legend:** ⚠️ wired but not functional until backend lands · ⛔ blocked, frontend can't proceed without it · 🟡 graceful degrade (works, but shows `—`/empty until data is populated)

_Last updated: 2026-06-26_

---

## ⚠️ Wired but NOT yet functional (backend work left)

### B8 — List filter params: `search` / `year` / `month`  → see API-FEEDBACK Item 8
The frontend now **sends** these query params, but the backend doesn't honour them yet, so the lists don't actually filter.

- [ ] `GET /api/bids` — support `search` (match product/farmer/title), `year`, `month`. Today only `page`/`limit` work.
- [ ] `GET /api/customers` — support **`month`** (new). `search` + `year` already work.

Notes:
- `month` is sent as a **1-based number** (Jan = 1 … Dec = 12), alongside `year`.
- `search` should match across the human-readable fields shown in each table.
- No frontend change needed once wired — params are already on the request.

---

## ⛔ Not done — backend-blocked (frontend cannot proceed)

### B9 — Agent-order tracking endpoint  → see API-FEEDBACK Item 9
The admin **track-agent** board (`/admin/track-orders/track-agent`) still renders hardcoded mock data because there is **no endpoint to list an agent's orders by delivery stage**. (The sibling track-transporter board is fully wired via `/api/transporters/fleet-trips`.)

Need one of:
- [ ] `GET /api/agents/{agentId}/orders?transportStatus=picked|on_transit|delivered` — agent's orders grouped by stage, **or**
- [ ] confirm `GET /api/orders?transportStatus=…` is scoped to the calling agent so the FE can reuse it.

Each order should populate: buyer (name), product(s) (name/image), amount, date.
→ Once this exists, the FE wires it identically to track-transporter.

---

## 🟡 Data-completeness (works, but shows `—`/empty until populated)

These are already connected; they just need the backend to **populate** the data.

### B-pop-1 — Populate trip fields on `/api/transporters/fleet-trips`  → API-FEEDBACK Items 1, 6, 7
Admin track-transporter Buyer/Transporter Info modals show `—` for any field the trip doesn't populate.
- [ ] Populate `transporter` (name, businessName, phone, email, state, image, rating).
- [ ] Populate `buyers[]` (name, businessName, phone, email, state, address, image).
- [ ] Populate `fleet` (fleetName/model, plateNumber, iot, image) + `fromLocation`/`toLocation`.

### B-pop-2 — Return `replies[]` on `GET /api/reviews`
Agent review replies POST correctly (`POST /api/reviews/{id}/reply`), but a posted reply only re-renders after refresh if the list response includes them.
- [ ] Ensure `GET /api/reviews` returns each review's `replies[]` ( `{ _id, message, repliedBy, createdAt }` ).

---

## ✅ Already connected (no backend action needed — for reference)
- Agent reviews: list / summary / reply / like.
- Fleet "Track" → trips board (server-side `?search=` already honoured).
- AddFleet status enum mapping.
- Admin track-transporter: Track Order (`/api/transporters/fleet-trips/{id}/tracking`), Buyer/Transporter Info (from `/api/transporters/fleet-trips`).

---

_Append new pending backend items below as frontend work surfaces them._
