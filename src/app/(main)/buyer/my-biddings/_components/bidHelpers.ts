import { BidResponse } from "@/services/bidService";

export const getAgentName = (bid: BidResponse): string => {
  if (typeof bid.agent === "object" && bid.agent !== null) {
    return bid.agent.name;
  }
  if (
    typeof bid.product.farmer === "object" &&
    bid.product.farmer !== null
  ) {
    return bid.product.farmer.name;
  }
  return "Unknown Seller";
};

export const getPriceDelta = (yourBid: number, theirCounter: number) => {
  const diff = theirCounter - yourBid;
  const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
  const formatted = `${sign}₦${Math.abs(diff).toLocaleString()}`;
  const tone =
    diff > 0 ? "text-[#c05621]" : diff < 0 ? "text-[#538e53]" : "text-[#808080]";
  return { formatted, tone };
};
