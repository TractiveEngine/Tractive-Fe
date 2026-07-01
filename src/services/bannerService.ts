// services/bannerService.ts

import api from "@/lib/axios";

export interface Banner {
  id: string;
  imageUrl: string;
  link?: string;
  alt?: string;
  position?: number;
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
      const body = response.data;
      const payload = body?.data ?? body;
      const list = Array.isArray(payload)
        ? payload
        : payload?.banners ?? payload?.items ?? [];

      return (Array.isArray(list) ? list : [])
        .map(mapBanner)
        .filter((b: Banner) => !!b.imageUrl)
        .sort((a: Banner, b: Banner) => (a.position ?? 0) - (b.position ?? 0));
    } catch (error) {
      console.error("[BannerService] getBanners error:", error);
      throw error;
    }
  },
};
