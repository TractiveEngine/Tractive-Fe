# Buyer Order Pages — API Gaps

The order API is working on both pages. To complete the UI, we still need the following from the backend.

---

## Page 1 — Track Orders (`/buyer/track-orders`)

API is wired and orders return correctly. To finish the UI, please send the following data on each order:

- **Transporter object** (populated, not just an ID): `name`, `logo`, `avatar`, `company`, `location`, `rating` (0–5), `ratingLabel`, `followers`, `yearsOfService`, `phone`.
- **Fleet/vehicle object** (when a fleet trip is assigned): `plateNumber`, `iotId`, `model`, `image`.
- **Status timeline** — timestamps for each transport stage: `pickedAt`, `onTransitAt`, `deliveredAt`, `estDeliveryDate` (or a `statusHistory` array).
- **Live tracking endpoint** — `GET /api/orders/{orderId}/tracking` → `{ currentLocation: { lat, lng }, lastUpdatedAt }` for the map marker.
- **Notify action** (Delivered tab) — endpoint to confirm receipt / nudge transporter, e.g. `POST /api/orders/{orderId}/confirm-receipt`.
- **Follow transporter** — `POST /api/transporters/{id}/follow` and `DELETE /api/transporters/{id}/follow`.

---

## Page 2 — Transactions (`/buyer/transactions`)

API is wired. To finish the UI, please send the following on each order:

- **Seller populated on product line** — `products[].product.owner` should return `{ _id, name, businessName, image }` instead of just an ID. (Sellers column.)
- **`paymentMethod`** field on the order — `bank_transfer`, `card`, `wallet`, `deposit`, etc. (Method column — currently hardcoded.)
- **Receipt endpoint** — `GET /api/orders/{orderId}/receipt` for the "View receipt" menu action.
- **Issue reporting endpoint** — `POST /api/orders/{orderId}/issues` with `{ category, description, attachments? }` for the "Report issue" menu action.
- **Live chat endpoint** — `POST /api/chats` with `{ orderId, sellerId }` returning a thread ID for the "Live Chat" button.
- **Support config endpoint** — `GET /api/config/support` returning hotline numbers (currently hardcoded).
- **(Optional)** server-side `?year=` and `?month=` query params on `GET /api/orders` for filtering.

---

## Quick questions

1. Where does the transporter come from — winning bid or fleet trip? Tells us which model to populate from.
2. Is there an existing GPS/IoT data source, or does live tracking need to be built from scratch?
3. What exactly should the "Notify" button do on delivered orders?
