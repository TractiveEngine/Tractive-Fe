# Products Module Update Prompt

## Context Reference

This task is a continuation of the existing **Products Module** (Produce List page, Add to Store modal, View/Edit modal, session-based auth, React Query). Follow all previously implemented architecture, patterns, and best practices (no localStorage auth, layout-level session handling, optimized frontend).

## 1️⃣ GET `/api/products` — Paginated, Filterable, Searchable

**Query parameters & behavior:**

* `page`, `limit` — for pagination
* `search` — search **product name OR farmer name** (input box, debounced)
* `status` — dropdown/accordion with options: `available`, `out_of_stock`, `discontinued`
* `category` — multi-select filter
* `owner`
* `minPrice` / `maxPrice` — filter range
* `from` / `to` — filter by creation date
* `sortBy`, `sortOrder`
* `full=true` — return full product document
* `includeMedia=true` — include images/videos in the list

**UI Requirements:**

* Search input box (debounced) for product/farmer names
* Dropdown/accordion for `status` filter (include **discontinued**)
* Multi-select for categories
* Price range slider
* Date range picker
* Pagination UI `< 1 2 3 ... 10 >` with total count
* Filter/sort/pagination changes trigger GET request

**Performance:**

* Use React Query with `keepPreviousData` for smooth transitions
* Skeleton loader for rows while fetching

## 2️⃣ POST `/api/products` — Add Product (with Cloudinary)

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "quantity": number,
  "discount": number,
  "status": "available/out_of_stock/discontinued",
  "unit": "string",
  "categories": ["string"],
  "images": ["string"],
  "videos": ["string"],
  "farmer": "string"
}
```

**Enhancements:**

* Integrate **Cloudinary** for image/video uploads
* Validate all required fields before submitting
* On success: append new product to local state, no full refetch

## 3️⃣ PUT `/api/products/{id}` — Update Product (Full Replace)

* Editable fields shown in modal: name, price, quantity, discount, images, videos
* Replace the full product document via PUT
* Include media URLs in request

## 4️⃣ PATCH `/api/products/{id}/status` — Single Status Update

* Change **status** only (`available`, `out_of_stock`, `discontinued`)
* Table updates immediately after change
* Out-of-stock table shows only `available` items
* Active table shows only `out_of_stock` items

## 5️⃣ PATCH `/api/products/bulk/status` — Bulk Status Update

* Accept `productIds` and `status`
* Update multiple products at once
* UI: select multiple products → click **update status**
* Local table updates instantly

## 6️⃣ DELETE `/api/products/bulk/delete` — Bulk Delete

* Multi-select or single delete
* Trigger **on click** in modal or table, no alert popup
* Update local table state immediately

## 7️⃣ Product Modal Behavior

**View-Only Mode:**

* Clicking a row opens modal showing **all product details**
* Images/videos displayed as previews
* No editing allowed

**Edit Mode:**

* Click **three dots → Edit**
* Only editable fields: name, price, quantity, discount, status, images, videos
* PUT request triggers update
* Table updates after successful edit

**Delete:**

* Click **three dots → Delete**
* Bulk or single delete supported

## 8️⃣ Additional Requirements

* Display **images/videos** in view and edit modals
* Discounted products included in **discontinued status table**
* All API error/success messages handled inline professionally
* Optimistic updates for edits, status changes, deletions
* Skeleton loaders for rows, fast rendering, avoid full-page reloads

## 9️⃣ Cloudinary Setup Notes

* Obtain **cloud name, API key, unsigned preset**
* Frontend uploads directly to Cloudinary
* Backend can optionally sign requests for security
* Upload multiple files, generate URLs for POST/PUT requests

## ✅ Deliverables Expected From AI

* Connect **edit, delete, status update** to buttons
* Full **pagination support** with UI
* Full **search/filter UI** according to new GET parameters
* Cloudinary upload integration for images/videos
* Proper modals: view-only vs editable
* Include **discontinued table** based on status
* Ensure professional error handling, loading states, and performance
