// services/categoryService.ts

import api from "@/lib/axios";

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

/**
 * Normalise one subcategory record. The backend may send a plain string
 * ("Maize"), or an object keyed by `_id`/`id` + `name`/`title`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapSubcategory = (raw: any): Subcategory => {
  if (typeof raw === "string") return { id: raw, name: raw };
  const name = raw?.name ?? raw?.title ?? raw?.label ?? "";
  return { id: raw?.id ?? raw?._id ?? name, name };
};

/**
 * Normalise one category record. Tolerates `subcategories`, `subCategories`,
 * or `children` for the nested list, and string-or-object subcategory items.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapCategory = (raw: any): Category => {
  const name = raw?.name ?? raw?.title ?? raw?.label ?? "";
  const subs =
    raw?.subcategories ?? raw?.subCategories ?? raw?.children ?? [];
  return {
    id: raw?.id ?? raw?._id ?? name,
    name,
    subcategories: Array.isArray(subs) ? subs.map(mapSubcategory) : [],
  };
};

/**
 * Category reference data (shared: Agent AddToStore, Buyer header/filters).
 *
 * GET /api/categories?withSubcategories=true
 * Expected: [{ id, name, subcategories: [{ id, name }] }]
 *
 * Uses the shared `@/lib/axios` instance (injects the auth token, handles 401).
 * The response envelope is unwrapped defensively so `{ data: [...] }`,
 * `{ categories: [...] }`, or a bare array all work.
 */
export class CategoryService {
  static async getCategories(withSubcategories = true): Promise<Category[]> {
    try {
      const response = await api.get("/api/categories", {
        params: withSubcategories ? { withSubcategories: true } : undefined,
      });

      const body = response.data;
      const payload = body?.data ?? body;
      const list = Array.isArray(payload)
        ? payload
        : payload?.categories ?? payload?.items ?? [];

      return (Array.isArray(list) ? list : []).map(mapCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}
