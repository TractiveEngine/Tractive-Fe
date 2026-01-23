# Frontend AI Task – Products Module (Continuation)

> **Context Reference (Do NOT ignore):**
> This task is a continuation of the previous prompts covering **session-based auth with NextAuth**, **role-based access**, **agent flow**, **farmers onboarding**, and **Add to Store modal behavior**. Reuse the same architectural patterns, auth handling, state strategy, and UI behavior already implemented for **/agent/farmers** and **AddToStore**. Do not reintroduce localStorage auth or duplicate auth logic.

---

## Scope (STRICT)

* Work **ONLY on Products**
* Do **NOT** change UI design direction, only restructure where necessary to fit API bodies
* Do **NOT** add, remove, rename, or modify any API below
* Reuse the **Add to Store** logic already discussed and implemented

---

## Authentication Rules

* Auth is **session-based (NextAuth)**
* No page-level auth duplication
* Layout-level auth already exists → rely on it
* Product pages must infer access from **session.activeRole === 'agent'**

---

## APIs (USE AS-IS)

### Get all products

```
GET /api/products
```

---

### Create product (primary – Add to Store)

```
POST /api/products
```

Request Body:

```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "quantity": number,
  "unit": "string",
  "categories": ["string"],
  "images": ["string"],
  "farmer": "{farmerID}"
}
```

---

### Update product quantity & price

```
PATCH /api/products/{id}
```

Request Body:

```json
{
  "price": number,
  "quantity": number
}
```

---

### Update product status

```
PATCH /api/products/:id/status
```

Request Body:

```json
{
  "status": "out_of_stock" | "available"
}
```

---

### Get out-of-stock products

```
GET /api/products/out-of-stock  

**Purpose:** Retrieve **only out-of-stock products**.  
❌ Must NOT be used to fetch active / available product list.
```

---

### Bulk delete products

```
POST /api/products/bulk/delete
```

Request Body:

```json
{
  "productIds": ["id", "id"]
}
```

---

### Bulk update product status

```
PATCH /api/products/bulk/status
```

Request Body:

```json
{
  "products": ["string"],
  "status": "available" | "out_of_stock"
}
```

---

### Alternate create product endpoint (DO NOT REMOVE)

```
POST /api/product/create/product
```

Request Body:

```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "quantity": number,
  "unit": "string",
  "categories": ["string"],
  "images": ["string"],
  "farmer": "string"
}
```

---

## UI & State Requirements

### Add to Store (Modal)

* Must list **available farmers** fetched earlier (no refetch after onboarding)
* Farmer selection is **required** before submit
* Validate all required fields before API call
* On success:

  * Append new product to local state
  * Do NOT refetch `/api/products`

---

### Produce List Page

* Add button: **"+ Add Product"**
* Button opens the **same Add to Store modal** (shared component)
* Product list should support:

  * Bulk select
  * Bulk delete
  * Bulk status update
* **Quantity display rule:** always render quantity together with its unit (e.g. `100 Kg`, `25 Bags`).
* **Out-of-stock logic:** do NOT mix with active product list. Active products come only from `GET /api/products`.

---

## Data Fetching Rules

* Use **TanStack React Query**
* Avoid repeated GET calls
* Mutations must optimistically update state
* Errors must be handled and surfaced clearly

---

## Code Quality Expectations

* Split large files into reusable components
* Shared logic between AddToStore & ProduceList
* Clear comments explaining:

  * API usage
  * State updates
  * Role checks

---

## DO NOT

* Do NOT touch unrelated features
* Do NOT add new APIs
* Do NOT reintroduce localStorage auth
* Do NOT refetch profile after product actions

---

## Suggestions (Optional)

If you notice improvements (UX, state reuse, performance), **list them clearly** at the end with:

* What to improve
* Why it helps
* How to implement
