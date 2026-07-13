// services/bannerService.ts

import api from "@/lib/axios";

export interface Banner {
  id: string;
  imageUrl: string;
  link?: string;
  alt?: string;
  position?: number;
}

/** A banner as the admin sees it — carries the scheduling/visibility fields too. */
export interface AdminBanner extends Banner {
  title: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

/** Request body for POST/PATCH /api/admin/banners — `imageUrl` is a Cloudinary URL. */
export interface BannerPayload {
  title: string;
  imageUrl: string;
  link?: string;
  alt?: string;
  position?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Normalise one banner record. Tolerates the documented shape
 * (`imageUrl`, `link`, `alt`, `position`) plus common variants
 * (`image`, `url`, `href`, `order`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBanner = (raw: any): Banner => {
  const imageUrl = raw?.imageUrl ?? raw?.image ?? raw?.url ?? raw?.src ?? "";
  return {
    id: String(raw?.id ?? raw?._id ?? imageUrl),
    imageUrl,
    link: raw?.link ?? raw?.href ?? undefined,
    alt: raw?.alt ?? raw?.title ?? undefined,
    position: raw?.position ?? raw?.order ?? undefined,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapAdminBanner = (raw: any): AdminBanner => ({
  ...mapBanner(raw),
  title: raw?.title ?? "",
  // Absent `isActive` means the backend didn't say — treat as live, matching
  // how the buyer feed serves anything it returns.
  isActive: raw?.isActive ?? true,
  startDate: raw?.startDate ?? undefined,
  endDate: raw?.endDate ?? undefined,
  createdAt: raw?.createdAt ?? undefined,
});

/** Pull a list out of `{ data: [...] }`, `{ banners: [...] }`, or a bare array. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrapList = (body: any): any[] => {
  const payload = body?.data ?? body;
  if (Array.isArray(payload)) return payload;
  const list = payload?.banners ?? payload?.items ?? [];
  return Array.isArray(list) ? list : [];
};

/**
 * Buyer homepage banners (BuyersHeader slider).
 *
 * GET /api/buyers/banners
 * Expected: [{ id, imageUrl, link, alt, position }]
 *
 * Uses the shared `@/lib/axios` instance (injects the auth token, handles 401).
 * The envelope is unwrapped defensively so `{ data: [...] }`,
 * `{ banners: [...] }`, or a bare array all work. Results are sorted by
 * `position` when the backend provides it.
 */
export const bannerService = {
  getBanners: async (): Promise<Banner[]> => {
    try {
      const response = await api.get("/api/buyers/banners");
      return unwrapList(response.data)
        .map(mapBanner)
        .filter((b: Banner) => !!b.imageUrl)
        .sort((a: Banner, b: Banner) => (a.position ?? 0) - (b.position ?? 0));
    } catch (error) {
      console.error("[BannerService] getBanners error:", error);
      throw error;
    }
  },

  /** GET /api/admin/banners — every banner, active or not. */
  getAdminBanners: async (): Promise<AdminBanner[]> => {
    try {
      const response = await api.get("/api/admin/banners");
      return unwrapList(response.data)
        .map(mapAdminBanner)
        .sort(
          (a: AdminBanner, b: AdminBanner) =>
            (a.position ?? 0) - (b.position ?? 0),
        );
    } catch (error) {
      console.error("[BannerService] getAdminBanners error:", error);
      throw error;
    }
  },

  /** GET /api/admin/banners/{id} */
  getAdminBanner: async (id: string): Promise<AdminBanner> => {
    try {
      const response = await api.get(`/api/admin/banners/${id}`);
      const body = response.data;
      return mapAdminBanner(body?.data ?? body?.banner ?? body);
    } catch (error) {
      console.error(`[BannerService] getAdminBanner ${id} error:`, error);
      throw error;
    }
  },

  /** POST /api/admin/banners */
  createBanner: async (payload: BannerPayload): Promise<AdminBanner> => {
    try {
      const response = await api.post("/api/admin/banners", payload);
      const body = response.data;
      return mapAdminBanner(body?.data ?? body?.banner ?? body);
    } catch (error) {
      console.error("[BannerService] createBanner error:", error);
      throw error;
    }
  },

  /** PATCH /api/admin/banners/{id} */
  updateBanner: async (
    id: string,
    payload: Partial<BannerPayload>,
  ): Promise<AdminBanner> => {
    try {
      const response = await api.patch(`/api/admin/banners/${id}`, payload);
      const body = response.data;
      return mapAdminBanner(body?.data ?? body?.banner ?? body);
    } catch (error) {
      console.error(`[BannerService] updateBanner ${id} error:`, error);
      throw error;
    }
  },

  /** DELETE /api/admin/banners/{id} */
  deleteBanner: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/admin/banners/${id}`);
    } catch (error) {
      console.error(`[BannerService] deleteBanner ${id} error:`, error);
      throw error;
    }
  },
};
