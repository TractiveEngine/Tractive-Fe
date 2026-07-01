import { Reviews } from "@/components/Reviews";
import {
  ArrowRightIcon,
  LikeIcon,
  ReplyIcon,
  StarIcon,
  YellowStarIcon,
} from "@/icons/Icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  useFollowFarmer,
  useUnfollowFarmer,
} from "@/hooks/queries/useUserQueries";

export interface OwnerInfo {
  id?: string;
  name?: string;
  image?: string;
  rating?: number;
  followersCount?: number;
  state?: string;
  isFollowing?: boolean;
}

export const OwnersInfo = ({ owner }: { owner?: OwnerInfo }) => {
  const [seeMore, setSeeMore] = useState(false);

  // ── Follow / Unfollow the transporter (fleet owner) ────────────────────
  const ownerId = owner?.id;
  const followMutation = useFollowFarmer();
  const unfollowMutation = useUnfollowFarmer();
  const [isFollowing, setIsFollowing] = useState<boolean>(!!owner?.isFollowing);
  const isFollowPending =
    followMutation.isPending || unfollowMutation.isPending;

  useEffect(() => {
    if (owner?.isFollowing !== undefined) setIsFollowing(!!owner.isFollowing);
  }, [owner?.isFollowing]);

  const handleFollowToggle = async () => {
    if (!ownerId || isFollowPending) return;
    const previous = isFollowing;
    setIsFollowing(!previous); // optimistic
    try {
      if (previous) {
        await unfollowMutation.mutateAsync(ownerId);
      } else {
        await followMutation.mutateAsync(ownerId);
      }
    } catch {
      setIsFollowing(previous); // revert on failure
      toast.error("Failed to update follow status. Please try again.");
    }
  };

  const handleSeeMore = () => {
    setSeeMore(!seeMore); // See More Reviews visibility
  };

  return (
    <div className="relative w-[100%] lg:w-[57%] flex flex-col gap-[10px]">
      <div className="flex flex-col gap-[12px] bg-[#fefefe] px-4 pt-2 pb-6 rounded-[5px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <p className="font-montserrat font-normal text-[#2b2b2b] text-[12px]">
          Transporters Information
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <Image
              src="/images/bidder2.png"
              alt="Sellers profile"
              width={45}
              height={45}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-montserrat font-normal text-[14px] text-[#2b2b2b] truncate">
                  {owner?.name || "Goddess Transport"}
                </span>
                <span className="w-[10px] h-[10px] rounded-[100px] bg-[#2b2b2b]"></span>
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={!ownerId || isFollowPending}
                  className={`cursor-pointer font-montserrat font-normal text-[14px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    isFollowing ? "text-[#808080]" : "text-[#538e53]"
                  }`}
                >
                  {isFollowPending
                    ? "..."
                    : isFollowing
                      ? "Following"
                      : "Follow"}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) =>
                  i < Math.round(owner?.rating ?? 4) ? (
                    <YellowStarIcon key={i} />
                  ) : (
                    <StarIcon key={i} />
                  )
                )}
                <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                  {(owner?.rating ?? 4).toFixed(1)}
                </span>
              </div>
              <small className="font-montserrat font-normal text-[11px] text-[#2b2b2b] truncate">
                {owner?.followersCount ?? 700} followers
              </small>
              {owner?.state && (
                <small className="font-montserrat font-normal text-[11px] text-[#2b2b2b] truncate">
                  {owner.state}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-1.5 bg-[#fefefe] px-4 pt-2 pb-6 rounded-[5px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <div className="relative flex items-center gap-2 flex-wrap">
            <Image
              src="/images/bidder4.png"
              alt="comment Profile"
              width={30}
              height={30}
            />
            <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
              Kelvin Chikezie
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <YellowStarIcon />
            <YellowStarIcon />
            <YellowStarIcon />
            <YellowStarIcon />
            <StarIcon />
          </div>
        </div>
        <div className="flex justify-between w-[100%] flex-wrap">
          <p className="font-montserrat w-[80%] font-normal text-[11px] text-[#2b2b2b]">
            Thank you mr kelvin, the corn i ordered has arrived and the are in
            good condition.
          </p>
          <span className="font-montserrat w-[20%] flex justify-end font-normal text-[11px] text-[#808080]">
            13 june, 2022
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Image
            src="/images/orderedImage.png"
            alt="Ordered Item"
            width={211}
            height={77}
          />
          <div className="flex items-center gap-[46px] truncate">
            <div className="flex items-center gap-[6px]">
              <ReplyIcon />
              <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                12 replies
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <LikeIcon />
              <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                12 Likes
              </span>
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer flex text-[#538e53] items-center justify-end gap-[4px]"
          onClick={handleSeeMore}
        >
          <span className="font-montserrat font-normal text-[12px] text-[#538e53]">
            See more
          </span>
          <ArrowRightIcon stroke="#538e53" className="w-4 h-4" />
        </div>
        {/* Conditionally render Reviews component with animation */}
        {seeMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-[15.7rem] z-60"
          >
            <Reviews onClose={handleSeeMore} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
