# Frontend Feedback — Tracking APIs

The frontend is already connected to all these endpoints. What we need is complete data and confirmed response formats. Here is exactly what's needed, per endpoint.

---

## 1. GET `/api/transporters/fleet-trips`
- Old trips saved as `pending` must still be returned when we filter `status=planned`, or they disappear from the board.
- Populate `fleet` (name, plate number, IOT, image) and `buyers` (name) inside each trip — IDs alone show as ugly codes on screen.

## 2. GET `/api/transporters/fleet/{fleetId}/bookings?status=confirmed` ⚠️
- **This endpoint was not in your list, but the Create Trip form depends on it.** Confirm it exists.
- Each booking must include **buyer name** and **load weight (kg)** — that's the label users see when selecting.

## 3. PATCH `/api/transporters/fleet-trips/{tripId}/status`
- Must accept a body with **status only**: `{ "status": "picked" }` (the quick button sends nothing else).
- Must also accept optional `location`, `lat`, `lng`.
- Must accept `cancelled` as a status.

## 4. POST `/api/orders/{orderId}/confirm-receipt`
- Works, but the order data has no field showing it was already confirmed — so after a refresh the button reappears and the buyer can confirm again.
- **Add `receiptConfirmedAt` (or a flag) to the order record**, and tell us what confirming actually changes on your side.

## 5. GET `/api/orders/{orderId}/tracking` — format never confirmed ⚠️
We call this every 30s for the buyer's live map, but we're guessing the response shape. Confirm exactly this:

```json
{
  "currentLocation": { "lat": 6.5244, "lng": 3.3792 },
  "locationLabel": "Ibadan toll gate",
  "lastUpdatedAt": "2026-06-12T10:30:00Z"
}
```

Without `currentLocation`, the buyer sees a frozen placeholder instead of a live map.

## 6. GET `/api/orders` — BIGGEST GAP 🚨
The buyer tracking page reads everything except GPS from the order list, and these fields are missing (page currently shows "N/A"):

| Screen needs | Fields required on each order |
|---|---|
| Transporter info | `transporter` populated: name, businessName, image, phone, rating |
| Truck info | `fleet`: model/fleetName, plate number, IOT, image |
| Timeline dates | `pickedAt`, `onTransitAt`, `deliveredAt` |
| Est. delivery | `estDeliveryDate` |
| Route | `fromLocation`, `toLocation` |

**Option A:** add these to the order records. **Option B:** return them all from `/api/orders/{orderId}/tracking` instead. Either works — tell us which.

## 7b. GET `/api/orders/{orderId}` — single order detail (NEW dependency) 🚨
The **agent Track Order page** (`/agent/delivered/trackorder/{orderId}`) now reads
this endpoint for one order instead of scanning the whole list. It needs the
**same populated fields as Item 6** on the single record:

| Screen needs | Fields required on the order |
|---|---|
| Transporter card | `transporter` populated: name, businessName, image, **phone**, rating, location, followers, yearsOfService, ratingLabel |
| Fleet/driver card | `fleet`: model/fleetName, plate number, IOT, image |
| Timeline + dates | `transportStatus`, `pickedAt`, `onTransitAt`, `deliveredAt`, `estDeliveryDate` |
| Route | `fromLocation`, `toLocation` |
| Packages table | `products[]` populated with product `name`, `images`, `description`, `_id` |

- **Confirm the response envelope.** We unwrap `{ success, data: { ...order } }`
  but also accept the bare order object. Tell us which you return.
- `transporter.phone` specifically drives the "call" modal — without it the modal
  shows "No contact number available".
- Until these land, the page renders real product/route data where available and
  "N/A" for the rest (same graceful-degrade behaviour as the buyer page).

## 8. List filtering — `search` / `year` / `month` query params ⚠️
Two agent list screens render filter controls that the frontend now **sends** as
query params, but the backend may not honour them yet. Please confirm/implement
server-side filtering for:

| Endpoint | Params now sent | Status |
|---|---|---|
| `GET /api/bids` | `search` (product/farmer/title), `year`, `month` (1–12) | **none supported today** — only `page`/`limit`. |
| `GET /api/customers` | `search`, `year` (already worked), **`month`** (1–12) | `month` is new; `search`/`year` already honoured. |

- `month` is sent as a **1-based number** (Jan = 1 … Dec = 12) alongside `year`.
- `search` should match across the human-readable fields shown in the table.
- Until these land, the controls post the params but the list is unfiltered
  (or filtered only by what the backend already supports). No frontend change is
  needed once you wire them — the params are already on the request.

## 9. Agent-order tracking — no endpoint exists ⚠️🚨
The **admin track-agent** board (`/admin/track-orders/track-agent`) still renders
a hardcoded `TrackAgentData` array because there is **no endpoint to list an
agent's orders by delivery stage**. The sibling track-transporter board is fully
wired (it has `/api/transporters/fleet-trips`); track-agent has no equivalent.

Need one of:
- `GET /api/agents/{agentId}/orders?transportStatus=picked|on_transit|delivered` — agent's orders grouped by stage, **or**
- confirmation that `GET /api/orders?transportStatus=…` is scoped to the calling agent so we can reuse it.

Each order should populate buyer (name), product(s) (name/image), amount, and date — the columns the board shows. Until this lands, track-agent stays on mock data (frontend is otherwise ready to wire it like track-transporter).

## 7. GET `/api/transporters/fleet-trips/{tripId}/tracking`
Confirm the response includes all of: `timeline` (status + timestamp), `pickedAt`/`onTransitAt`/`deliveredAt`, populated `buyers` (name, state, phone, address, image), populated `packages` (name, image), `origin`/`destination`, current `lat`/`lng`.

⚠️ `estDeliveryDate`: nothing ever sets this value today. Backend must calculate it, or the screen shows "EST —" forever.

---

## No action needed
- `GET /fleet-trips/{tripId}` (summary) — no screen uses it; we use `/tracking` instead.
- Legacy routes (`/api/transporters/orders/{orderId}/tracking` and `/status`) — no longer used by the app. Keep for compat only.

---

## Priority
1. **Item 6** — blocks the buyer tracking page (mostly "N/A" right now).
2. **Item 7b** — same populated fields on `GET /api/orders/{orderId}`; blocks the agent Track Order page.
3. **Item 5** — blocks the live map (buyer + agent share it).
4. **Item 2** — blocks trip creation if the endpoint doesn't exist.
5. Items 1, 3, 4, 7 — confirmations and small additions.
6. **Item 8** — list filter params (`search`/`year`/`month`) on bids + customers; low risk, frontend already sends them.
