import { ReviewIcon, XIcon } from "@/icons/Icon1";
import { LikeIcon, ReplyIcon, StarIcon, YellowStarIcon } from "@/icons/Icons";
import { useAnimation, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";

// Define TypeScript interfaces for the data structure
interface User {
  name: string;
  avatar: string;
}

interface Rating {
  stars: string;
  count: number;
  percentage: number;
}

interface Review {
  id: number;
  user: User;
  rating: number;
  comment: string;
  date: string;
  image: string;
  replies: number;
  likes: number;
}

interface ReviewData {
  overallRating: number;
  totalReviewers: number;
  ratings: Rating[];
  reviews: Review[];
  reviewerAvatars: string[];
}

// Props interface for the Reviews component
interface ReviewsProps {
  onClose: () => void;
}

// Sample review data
const reviewData: ReviewData = {
  overallRating: 4.0,
  totalReviewers: 25000,
  ratings: [
    { stars: "5 star", count: 8000, percentage: 80 },
    { stars: "4 star", count: 6000, percentage: 60 },
    { stars: "3 star", count: 4000, percentage: 40 },
    { stars: "2 star", count: 2000, percentage: 20 },
    { stars: "1 star", count: 1000, percentage: 10 },
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: "Kelvin Chikezie",
        avatar: "/images/bidder4.png",
      },
      rating: 4,
      comment:
        "Thank you Mr. Kelvin, the corn I ordered has arrived and they are in good condition.",
      date: "2022-06-13",
      image: "/images/orderedImage.png",
      replies: 12,
      likes: 12,
    },
    {
      id: 2,
      user: {
        name: "Amara Okoye",
        avatar: "/images/bidder3.png",
      },
      rating: 5,
      comment:
        "Amazing service! The delivery was fast, and the grains were fresh.",
      date: "2022-07-01",
      image: "/images/orderedImage.png",
      replies: 8,
      likes: 15,
    },
    {
      id: 3,
      user: {
        name: "Chidi Nwosu",
        avatar: "/images/bidder2.png",
      },
      rating: 3,
      comment: "The order was okay, but the packaging could be improved.",
      date: "2022-08-15",
      image: "/images/orderedImage.png",
      replies: 5,
      likes: 7,
    },
  ],
  reviewerAvatars: [
    "/images/bidder1.png",
    "/images/bidder2.png",
    "/images/bidder3.png",
    "/images/bidder4.png",
  ],
};

export const Reviews: React.FC<ReviewsProps> = ({ onClose }) => {
  const { overallRating, totalReviewers, ratings, reviews, reviewerAvatars } =
    reviewData;

  // Initialize individual animation controls for each rating
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();
  const control5 = useAnimation();

  // Memoize the controls array
  const controls = useMemo(
    () => [control1, control2, control3, control4, control5],
    [control1, control2, control3, control4, control5]
  );

  useEffect(() => {
    // Start animation for each progress bar on mount
    controls.forEach((control, index) => {
      control.start({
        width: `${ratings[index].percentage}%`,
        transition: { duration: 1, ease: "easeOut" },
      });
    });
  }, [controls, ratings]);

  // Helper to render star icons based on rating
  const renderStars = (rating: number): React.ReactElement[] => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? <YellowStarIcon key={i} /> : <StarIcon key={i} />
      );
    }
    return stars;
  };

  // Define left offsets for mobile and sm screens
  const leftOffsetsMobile = [0, 10, 20, 30];
  const leftOffsetsSm = [0, 12, 28, 40];

  // Debug avatar paths
  console.log("Reviewer Avatars:", reviewerAvatars);

  return (
    <div className="relative bg-[#fefefe] flex flex-col items-center w-full max-w-[600px] md:max-w-[721px] overflow-y-auto max-h-[90vh] hide-scrollbar px-6 py-6 gap-3 rounded-[7px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
      <div className="absolute top-3 right-3 cursor-pointer" onClick={onClose}>
        <XIcon />
      </div>
      <div className="flex items-center w-full flex-col sm:flex-row gap-3 pt-3.5">
        <div className="flex flex-col w-[100%] bg-[#f1f1f1] p-1.5">
          <div className="flex items-center gap-[4px]">
            <div className="flex items-center gap-1.5">
              {renderStars(overallRating)}
            </div>
            <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
              {overallRating.toFixed(1)}
            </span>
          </div>
          <span className="w-full h-[1px] bg-[#fefefe] mt-1"></span>
          <div className="flex flex-col w-[100%] bg-[#f1f1f1] p-0.5">
            {ratings.map((rating, index) => (
              <div
                key={rating.stars}
                className="flex items-center gap-1 sm:gap-2 w-full"
              >
                <div className="flex items-center gap-1">
                  <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                    {rating.stars}
                  </span>
                </div>
                <div className="flex-1 h-[4px] bg-[#e0e0e0] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FFA500]"
                    initial={{ width: 0 }}
                    animate={controls[index]}
                  />
                </div>
                <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                  {rating.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-[100%] sm:w-[100%] bg-[#f1f1f1] p-4">
          <div className="flex gap-2 items-center justify-start">
            <div className="flex gap-2 items-center justify-center bg-[#f1f1f1] w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] p-1 rounded-[100px]">
              <ReviewIcon />
            </div>
            <p className="font-montserrat font-normal text-[10px] sm:text-[15px] text-[#2b2b2b] truncate">
              Reviews
            </p>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="relative w-[40px] h-[40px] overflow-visible">
                {reviewerAvatars.length > 0 ? (
                  reviewerAvatars.map((avatar, index) => (
                    <Image
                      key={index}
                      src={avatar}
                      alt={`Reviewer ${index + 1}`}
                      width={50}
                      height={50}
                      className={`absolute left-[${leftOffsetsMobile[index]}px] sm:left-[${leftOffsetsSm[index]}px] z-50
                      }] w-[35px] h-[35px] rounded-full border-2 border-[#fefefe]`}
                      onError={(e) => {
                        console.error(`Failed to load image: ${avatar}`);
                        e.currentTarget.src = "/images/placeholder.png"; // Fallback image
                      }}
                    />
                  ))
                ) : (
                  <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                    No avatars available
                  </span>
                )}
              </div>
              <p className="font-montserrat font-normal text-[11px] sm:text-[15px] text-[#2b2b2b]">
                + {totalReviewers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="flex flex-col gap-6 w-full">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col gap-1.5 pt-2 rounded-[5px]"
          >
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <div className="relative flex items-center gap-2 flex-wrap">
                <Image
                  src={review.user.avatar}
                  alt="Comment Profile"
                  width={30}
                  height={30}
                />
                <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
                  {review.user.name}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="flex justify-between w-[100%] flex-wrap">
              <p className="font-montserrat w-[80%] font-normal text-[11px] text-[#2b2b2b]">
                {review.comment}
              </p>
              <span className="font-montserrat w-[20%] flex justify-end font-normal text-[11px] text-[#808080]">
                {new Date(review.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <Image
                src={review.image}
                alt="Ordered Item"
                width={211}
                height={77}
              />
              <div className="flex items-center gap-[46px] truncate">
                <div className="flex items-center gap-[6px]">
                  <ReplyIcon />
                  <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                    {review.replies} replies
                  </span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <LikeIcon />
                  <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                    {review.likes} Likes
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
