# BACKEND API REQUIREMENTS & OUTSTANDING WORK

**Project:** Tractive
**Document Version:** 1.0
**Date Issued:** 29 April 2026
**Prepared By:** Frontend Engineering Team
**Distribution:** Backend Engineering Team
**Status:** For Action

---

## 1. EXECUTIVE SUMMARY

This document captures the outstanding frontend integration work across the four user roles in the Tractive web application: **Admin, Agent, Buyer, and Transporter.** It enumerates:

- Frontend areas currently rendering hardcoded fixtures or stubbed handlers.
- API endpoints required from the backend to complete each feature.
- Existing API contracts the backend should be aware of.
- A recommended delivery sequence based on user impact and risk.

Each section is self-contained and may be assigned to backend engineers independently.

---

## 2. SCOPE & EXISTING CONTRACTS

### 2.1 Out of Scope

- UI/UX changes
- Frontend refactors unrelated to API integration
- Authentication overhaul (current `/api/profile` flow is sufficient)

### 2.2 Established Service Contracts

The frontend has the following services and React Query hooks already wired. These represent the **agreed contract**; only deltas to these are requested below.

- `adminUserService`
- `bidService`
- `customerService`
- `driverService`
- `FarmerService`
- `fleetService`
- `negotiationService`
- `notificationService`
- `OrderService`
- `productService`
- `reviewService`
- `transactionService`
- `transporterService`
- `UserService`

---

## 3. ADMIN MODULE

### 3.1 Outstanding Frontend Work

- **Dashboard (`admin/page.tsx`)** — all widgets render hardcoded data:
  - `AdminOverview.tsx` — stat cards (`$25,550,000`, `250`, `35`, `550`)
  - `AdminRevenueChart.tsx` — 12-month dataset declared as a literal constant
  - `TopAgents.tsx`, `TopBuyer.tsx`, `TopTransporter.tsx` — local arrays of placeholder names
- **Approvals**
  - `admin/new/page.tsx` and `admin/declined/page.tsx` render fixtures from `@/utils/Approvals`
  - Approve and decline handlers only emit `console.log`
  - `declined` is a duplicate of `new` (no persistence layer)
- **Track Orders**
  - `admin/track-orders/track-agent/page.tsx` — fixture-based, no API call
  - `admin/track-orders/track-transporter/page.tsx` — fixture-based, no API call
  - `TrackTransporterActionMenu.tsx` (lines 73, 85, 97) — handlers stubbed to `console.log`
- **All-Users Sub-Tabs**
  - `AgentType.tsx:251`, `BuyerType.tsx:249`, `FarmerType.tsx:250`, `TransporterTypes.tsx:248` carry the comment `// TODO: Implement view profile functionality`
- **All-Users Filters**
  - `state`, `month`, and `year` filters operate client-side only (`AllUserType.tsx`)
  - Backend currently rejects these query parameters
- **Removed Users Page**
  - `admin/removed/page.tsx` does not paginate (`limit: 100` hardcoded), inconsistent with sibling pages
- **Transactions**
  - `page.tsx:144` and `TransactionDetailModal.tsx:81` leak `console.log` statements
  - `RefundedActionMenu.tsx` links to `/admin/chat`, which is not a routed page
- **Generic Table Defaults**
  - `AdminTableList.tsx` contains 15+ default handlers that fall back to `alert()` and `console.log` when parents do not wire actions

### 3.2 Required Endpoints

#### 3.2.1 Dashboard Analytics

- **`GET /api/admin/dashboard/overview`**
  - Response: `{ users, payments, orders, visitors }` — each as `{ value, deltaPercent }`
- **`GET /api/admin/dashboard/revenue?period=month|year&from&to`**
  - Response: `{ data: [{ date, value }] }`
- **`GET /api/admin/dashboard/top-agents?limit=5`**
  - Response: `[{ id, name, image, location, revenue, orders }]`
- **`GET /api/admin/dashboard/top-buyers?limit=7`**
  - Response: `[{ id, name, image, totalSpent }]`
- **`GET /api/admin/dashboard/top-transporters?limit=5`**
  - Response: `[{ id, name, image, location, revenue, bookings }]`

#### 3.2.2 Approvals

- **`GET /api/admin/approvals`**
  - Query: `type={agent|farmer}`, `status={pending|approved|declined}`, `search`, `page`, `limit`, `year`, `month`, `state`
  - Response: `{ data: ApprovalApplication[], pagination }`
- **`POST /api/admin/approvals/{id}/approve`**
  - Body: `{ note?: string }`
- **`POST /api/admin/approvals/{id}/decline`**
  - Body: `{ reason: string }`

#### 3.2.3 Order Tracking (Admin Oversight)

- **`GET /api/admin/orders/track/agent`** — Query: `status={paid|delivered}`, `page`, `limit`, `search`, `year`, `month`
- **`GET /api/admin/orders/track/transporter`** — Query: `status={picked|on_transit|delivered}`, `page`, `limit`
- **`GET /api/admin/orders/{orderId}/buyer-info`**
- **`GET /api/admin/orders/{orderId}/seller-info`**
- **`GET /api/admin/orders/{orderId}/transporter-info`**
- **`GET /api/admin/orders/{orderId}/tracking`**

#### 3.2.4 Updates to Existing Endpoints

- **`GET /api/admin/users`** — accept `state`, `month`, and `year` query parameters server-side

---

## 4. AGENT MODULE

### 4.1 Outstanding Frontend Work

- **Dashboard (`agent/page.tsx`)** — all widgets render hardcoded data:
  - `FarmerOverview.tsx`
  - `FarmerRevenueChart.tsx`
  - `TopCustomers.tsx`
  - `OutOfStock.tsx`
  - `MostSoldItem.tsx`
  - `MostSoldCategoryPieChart.tsx`
- **Customers (`agent/customers/page.tsx`)**
  - `customerService` does not transmit `search`, `location`, `page`, or `limit` (per inline `// For testing` comment)
  - Debug call `testApiEndpoint()` fires on mount
- **Reviews (`agent/reviews/page.tsx`)**
  - `agentId` defaults to literal `"default-agent-id"`; not resolved from session
  - No UI for replies despite the `reply` endpoint existing
  - Client fetches `limit=1000` and aggregates the summary in JavaScript
- **Order Tracking**
  - `agent/delivered/trackorder/[productId]/page.tsx` renders `DeliveredProductData` fixture with a fake 5-second `setTimeout`
  - Hardcoded buyer, transporter, and route data in:
    - `OrderTrackingAndTransportInfo.tsx`
    - `TransportInfoAndPackageProduct.tsx`
    - `MapTrackingTimeline.tsx`
    - `PackagedTable.tsx`
- **Catalog**
  - `AddToStore.tsx` — categories list is hardcoded
- **Stray Debug Logs**
  - `FarmerActionMenu.tsx:111`
  - `PendingTableList.tsx`
  - `ReceivedTableList.tsx` — `console.log(transactionId)`

### 4.2 Required Endpoints

#### 4.2.1 Dashboard

- **`GET /api/agents/dashboard/overview`** — `{ revenue, orders, customers, products, deltas }`
- **`GET /api/agents/dashboard/revenue?from&to&granularity`** — area-chart series
- **`GET /api/agents/dashboard/top-customers?limit=5`** — `[{ id, name, image, ordersCount, revenue }]`
- **`GET /api/agents/dashboard/most-sold-items?limit=10`** — `[{ productId, name, image, quantitySold, revenue }]`
- **`GET /api/agents/dashboard/most-sold-categories`** — `[{ category, percentage, value }]`
- **`GET /api/agents/dashboard/out-of-stock?limit=7`** — small list for the dashboard widget

#### 4.2.2 Reviews Summary

- **`GET /api/reviews/summary?agentId={id}`**
  - Response: `{ overallRating, totalReviews, ratingDistribution: [{ rating, count, percentage }], recentReviewers: [{ id, name, avatar }] }`
  - Replaces the current client-side aggregation pattern

#### 4.2.3 Session

- **`GET /api/agents/me`**
  - Response: `{ id, name, email, ... }`
  - May wrap `/api/profile`; required so reviews can stop using `"default-agent-id"`

#### 4.2.4 Order Detail & Tracking

- **`GET /api/agents/orders/{orderId}`**
  - Response: full order including buyer profile (name, address, phone), seller, product list, transporter assignment, current step, IOT, plate number, route
- **`GET /api/agents/orders/{orderId}/tracking`**
  - Response: `{ pickedAt, onTransitAt, deliveredAt, fromState, toState, mapMarkers }`

#### 4.2.5 Updates to Existing Endpoints

- **`GET /api/customers`** — must honour `search`, `location`, `page`, `limit` parameters

#### 4.2.6 Catalog Taxonomy (Shared with Buyer)

- **`GET /api/categories?withSubcategories=true`**
  - Response: `[{ id, name, subcategories: [{ id, name }] }]`

---

## 5. BUYER MODULE

### 5.1 Outstanding Frontend Work

- **Hardcoded Bank Accounts (Risk: Payment Routing)**
  - `my-biddings/_components/BankAccounts.tsx`
  - `transporter-list/_components/BookingTransport/BookingHeader/BankAccounts.tsx`
- **Layout Initialisation**
  - `buyer/layout.tsx` seeds `FollowingProvider` with hardcoded names; should consume existing `userService.getTopSellers()`
- **Marketing**
  - `BuyersHeader.tsx` — banner slider images are literal paths
- **Filters**
  - `FilterProduct.tsx` — `interests` array is hardcoded (sub-categories)
- **Cards**
  - `TransporterCard.tsx` — `"All States"` badge is literal; should reflect transporter `coverageStates`
  - `TransporterCard.tsx` (line ~82) and `SellerCard.tsx` (line ~84) contain empty `onClick={() => {}}` handlers

> **Note:** The remaining buyer flows (home, sellers list, product detail, transporter list, my-biddings, my-orders, wish-list) are approximately 95% wired to live services.

### 5.2 Required Endpoints

#### 5.2.1 Payment & Banking

- **`GET /api/payment/bank-accounts`**
  - Response: `[{ id, bank, accountName, accountNumber, logoUrl, sortOrder }]`
  - Replaces both hardcoded bank lists
- **`POST /api/payments/{paymentRef}/confirm`**
  - Body: `{ bankUsed, narration?, screenshotUrl? }`
  - Manual transfer confirmation

#### 5.2.2 Marketing / Homepage

- **`GET /api/buyers/banners`**
  - Response: `[{ id, imageUrl, link, alt, position }]`

#### 5.2.3 Catalog Taxonomy (Shared with Agent)

- **`GET /api/categories?withSubcategories=true`**

#### 5.2.4 Updates to Existing Endpoints

- **`GET /api/transporters`** — include `coverageStates: string[]` and `customersCount: number` in the response

---

## 6. TRANSPORTER MODULE

### 6.1 Outstanding Frontend Work

- **Dashboard (`transporter/page.tsx`)** — all widgets render hardcoded data:
  - `TransporterOverview.tsx`
  - `TransporterRevenueChart.tsx`
  - `MostHired.tsx`
  - `TopCustomers.tsx`
  - `TransitTable.tsx`
- **Customers (`transporter/customers/page.tsx`)**
  - Built entirely on `TransporterCustomersData` fixture
  - `handleCustomerInfo` and `handleSupport` only emit `console.log`
  - No service exists for this resource
- **Order Tracking — `delivered/page.tsx`, `new/page.tsx`, `on-transit/page.tsx`, `picked/page.tsx`**
  - All four are identical static demo screens
  - `handlePickedClick`, `handleTransitClick`, `handleDeliveredClick` only flip local boolean state
  - The existing `OrdersApiService.updateTransportStatus` is **never invoked**
  - No list view surfaces real assigned orders
  - Hardcoded buyer, transporter, and route data in:
    - `TransportInfoAndPackageProduct.tsx`
    - `MapTrackingTimeline.tsx`
    - `PackagedTable.tsx`
    - `_components/orderTracking/{New,Picked,OnTransit,Delivered}OrderTracking.tsx`
- **Fleet Tracking**
  - `ALLTransit.tsx:158` — `// TODO: Implement tracking functionality`
  - Uses `window.confirm` and `alert` instead of the application's toast component
- **Forms**
  - `AddFleet.tsx` — `nigerianStates` hardcoded
  - `DriverDetailsForm.tsx:153` — `console.log("Form submitted:", formData)` (file may be dead code; please confirm with frontend)

### 6.2 Required Endpoints

#### 6.2.1 Dashboard

- **`GET /api/transporters/dashboard/overview`** — `{ revenue, bookings, drivers, fleets, deltas }`
- **`GET /api/transporters/dashboard/revenue?from&to`**
- **`GET /api/transporters/dashboard/most-hired-drivers?limit=5`** — `[{ id, name, image, hires, rating }]`
- **`GET /api/transporters/dashboard/top-customers?limit=5`**
- **`GET /api/transporters/dashboard/transit?status=in_progress&limit=10`** — feeds `TransitTable.tsx`

#### 6.2.2 Customers

- **`GET /api/transporters/customers?search&year&month&page&limit`**
  - Response: `[{ id, name, image, state, mobile, orders, revenue, date }]`
- **`GET /api/transporters/customers/{id}`** — full profile (Customer Info modal)
- **`POST /api/transporters/customers/{id}/chat`**
  - Body: `{ message, subject }` (Support modal)

#### 6.2.3 Order List & Tracking — **CRITICAL**

> All four delivery pages are empty shells today.

- **`GET /api/transporters/orders?status={new|picked|on_transit|delivered}&page&limit&search&year&month`**
- The "Mark as Picked / On Transit / Delivered" buttons must invoke the **already-defined** endpoint:
  - **`PATCH /api/transporters/orders/{orderId}/status`** — Body: `{ transportStatus, note?, location? }`
- **`POST /api/transporters/orders/{orderId}/locations`** — Body: `{ lat, lng, timestamp }` (optional GPS pings for live map)

#### 6.2.4 Reviews

- **`GET /api/transporters/{id}/reviews/summary`** — mirror of agent reviews summary

#### 6.2.5 Reference Data

- **`GET /api/states`** — Nigerian states (replaces hardcoded list)
- **`GET /api/transporters/fleet-statuses`** — `["available", "under_maintenance", "on_transit"]`

---

## 7. CROSS-CUTTING REQUIREMENTS

### 7.1 Notifications

- **`PATCH /api/notifications/{id}`** — Body: `{ isRead: true }`
  - Per-item read; today only "mark all" is supported
- **`GET /api/notifications?unread=true&page&limit`**
  - Server-side filter and pagination
- **`GET /api/notifications/stream`**
  - SSE or WebSocket channel for live push (currently the dropdown polls)

### 7.2 Shared Reference Data

- **`GET /api/categories?withSubcategories=true`** — used by agent product upload and buyer filters
- **`GET /api/states`** — Nigerian states (fleet creation, driver onboarding, filters)
- **`GET /api/payment/bank-accounts`** — admin-managed; buyer pages currently hardcode

### 7.3 Frontend Cleanup (Pre-Release)

The following debug statements will be removed by the frontend team prior to release. Listed for backend awareness only:

- `customerService.ts`
- `reviewService.ts`
- `FarmerService.ts`
- `productService.ts`
- `admin/transactions/page.tsx:144`
- `TransactionDetailModal.tsx:81`
- `TrackTransporterActionMenu.tsx`
- `FarmerActionMenu.tsx:111`
- `DriverDetailsForm.tsx:153`
- `transporter/negotiations/page.tsx:210`

---

## 8. DELIVERY STATUS SUMMARY

| # | Module / Area | Frontend Wired | Outstanding Backend Work |
|---|---|---|---|
| 1 | Admin — Dashboard | 0 / 5 widgets | overview, revenue, top-agents, top-buyers, top-transporters |
| 2 | Admin — Approvals (new + declined) | 0% | approvals list, approve, decline |
| 3 | Admin — Track Orders | 0% | track/agent, track/transporter, info endpoints |
| 4 | Admin — Users / Transactions / Active / Suspended / Removed | ~85% | server-side `state`/`month`/`year` filters |
| 5 | Agent — Dashboard | 0 / 6 widgets | overview, revenue, top-customers, most-sold (×2), out-of-stock |
| 6 | Agent — Farmers / Produce / Bids / Reviews / Orders | ~90% | reviews summary, agents/me, order tracking, categories |
| 7 | Buyer — All flows | ~95% | bank-accounts, banners, categories, coverageStates |
| 8 | Transporter — Dashboard | 0 / 5 widgets | overview, revenue, most-hired, top-customers, transit |
| 9 | Transporter — Customers | 0% | customers list, customer detail, chat |
| 10 | Transporter — Order Tracking | 0% | orders list (status PATCH already exists, awaits wiring) |
| 11 | Notifications (shared) | ~80% | per-item read, unread filter, stream |

---

## 9. RECOMMENDED DELIVERY SEQUENCE

| Priority | Workstream | Rationale |
|---|---|---|
| 1 | Transporter order tracking endpoints | Frontend pages exist; status PATCH already implemented; only the list endpoint blocks completion |
| 2 | Dashboard analytics (all four roles) | Largest visible gap; high stakeholder visibility |
| 3 | Admin approvals | Workflow currently non-functional |
| 4 | Buyer bank accounts | Direct payment-routing risk |
| 5 | Agent reviews summary + `agents/me` | Quick wins; resolves obvious defects |
| 6 | Categories / states / fleet-statuses | Small reference endpoints; unblock multiple components |
| 7 | Notifications enhancements | Per-item read, unread filter, live stream |
| 8 | Admin track-orders | Requires further product input on data exposure |

---

## 10. POINTS OF CONTACT

| Area | Contact |
|---|---|
| Frontend Lead | _to be filled_ |
| Backend Lead | _to be filled_ |
| Product Owner | _to be filled_ |

---

## 11. APPROVAL

| Role | Name | Signature | Date |
|---|---|---|---|
| Frontend Lead |  |  |  |
| Backend Lead |  |  |  |
| Product Owner |  |  |  |

---

*End of document.*
