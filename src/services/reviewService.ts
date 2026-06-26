// services/reviewService.ts

import api from "@/lib/axios";

export interface Review {
  _id: string;
  agent: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  replies?: ReviewReply[];
}

export interface ReviewReply {
  _id: string;
  message: string;
  repliedBy: string;
  createdAt: string;
}

export interface ReviewSummary {
  overallRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  recentReviewers: string[]; // avatar URLs or user IDs
}

export interface GetReviewsResponse {
  reviews: Review[];
}

export interface CreateReviewPayload {
  agentId: string;
  rating: number;
  comment: string;
}

export interface ReplyToReviewPayload {
  message: string;
}

/**
 * Review API.
 *
 * Uses the shared `@/lib/axios` instance, which injects the NextAuth Bearer
 * token and handles 401 refresh/logout centrally. (Previously this read a
 * never-set `localStorage.authToken`, so every request went out unauthenticated.)
 */
export class ReviewService {
  /**
   * Get all agent reviews
   * GET /api/reviews
   */
  static async getReviews(): Promise<GetReviewsResponse> {
    try {
      const response = await api.get<
        { reviews?: Review[]; data?: Review[] } | Review[]
      >("/api/reviews");

      const body = response.data;
      const reviews: Review[] = Array.isArray(body)
        ? body
        : body?.reviews ?? body?.data ?? [];

      return { reviews };
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

  /**
   * Get reviews summary (ratings distribution, overall rating, etc.)
   */
  static async getReviewsSummary(): Promise<ReviewSummary> {
    try {
      const reviewsResponse = await this.getReviews();
      const reviews = reviewsResponse.reviews;

      // Calculate summary data
      const totalReviews = reviews.length;
      const overallRating =
        totalReviews > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          : 0;

      // Calculate rating distribution
      const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => {
        const count = reviews.filter(
          (review) => review.rating === rating,
        ).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return {
          rating,
          count,
          percentage: Math.round(percentage),
        };
      });

      // Get recent reviewers (first 4 for avatars)
      const recentReviewers = reviews
        .slice(0, 4)
        .map((review) => review.buyer.name); // Using names as placeholder for avatars

      const summary = {
        overallRating: parseFloat(overallRating.toFixed(1)),
        totalReviews,
        ratingDistribution,
        recentReviewers,
      };

      return summary;
    } catch (error) {
      console.error("Error fetching reviews summary:", error);

      // Return empty summary on error
      const emptySummary = {
        overallRating: 0,
        totalReviews: 0,
        ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({
          rating,
          count: 0,
          percentage: 0,
        })),
        recentReviewers: [],
      };

      return emptySummary;
    }
  }

  /**
   * Create a new review
   */
  static async createReview(
    payload: CreateReviewPayload,
  ): Promise<{ review: Review }> {
    try {
      const response = await api.post<{ review: Review }>(
        "/api/reviews",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  /**
   * Reply to a review
   */
  static async replyToReview(
    reviewId: string,
    payload: ReplyToReviewPayload,
  ): Promise<{ reply: ReviewReply }> {
    try {
      const response = await api.post<{ reply: ReviewReply }>(
        `/api/reviews/${reviewId}/reply`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error replying to review:", error);
      throw error;
    }
  }

  /**
   * Like a review
   */
  static async likeReview(
    reviewId: string,
  ): Promise<{ message: string; likes: number }> {
    try {
      const response = await api.post<{ message: string; likes: number }>(
        `/api/reviews/${reviewId}/like`,
      );
      return response.data;
    } catch (error) {
      console.error("Error liking review:", error);
      throw error;
    }
  }
}
