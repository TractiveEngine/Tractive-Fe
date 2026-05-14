// services/reviewService.ts

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

interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export class ReviewService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Get authentication token from localStorage
   */
  private static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  /**
   * Build headers with authentication
   */
  private static buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = this.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let error: ApiError;

      try {
        const errorText = await response.text();
        console.error("📄 Error response body:", errorText);

        error = errorText
          ? JSON.parse(errorText)
          : {
              message: response.statusText || "An error occurred",
              statusCode: response.status,
            };
      } catch (parseError) {
        console.error("❌ Error parsing error response:", parseError);
        error = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      // Handle specific status codes
      if (response.status === 404) {
        console.error("🚨 404 - Endpoint not found");
        error.message = `API endpoint not found: ${response.url}`;
      }

      // Handle authentication errors
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }

      throw error;
    }

    // If response is OK, parse and return
    try {
      const data = await response.json();
      console.log("✅ API call successful");
      return data;
    } catch (parseError) {
      console.error("❌ Error parsing successful response:", parseError);
      throw {
        message: "Failed to parse response",
        statusCode: 500,
      };
    }
  }

  /**
   * Make GET request with detailed debugging
   */
  private static async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    console.log("🚀 Making API request:");
    console.log("   URL:", url);
    console.log("   Base URL:", this.baseURL);
    console.log("   Endpoint:", endpoint);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.buildHeaders(),
      });

      console.log("📡 Response received:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log("   URL:", response.url);
      console.log("   OK:", response.ok);

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("💥 Fetch failed completely:", error);
      throw error;
    }
  }

  /**
   * Make POST request
   */
  private static async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    console.log("🚀 Making POST request:");
    console.log("   URL:", url);
    console.log("   Data:", data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.buildHeaders(),
        body: JSON.stringify(data),
      });

      console.log("📡 Response received:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("💥 POST request failed:", error);
      throw error;
    }
  }

  /**
   * Get all agent reviews
   * GET /api/reviews
   */
  static async getReviews(): Promise<GetReviewsResponse> {
    try {
      const response = await this.get<
        { reviews?: Review[]; data?: Review[] } | Review[]
      >("/api/reviews");

      const reviews: Review[] = Array.isArray(response)
        ? response
        : response?.reviews ?? response?.data ?? [];

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

      console.log("✅ Reviews summary calculated:", summary);
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

      console.log("🔄 Returning empty summary due to error");
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
      console.log("📝 Creating new review:", payload);
      const response = await this.post<{ review: Review }>(
        "/api/reviews",
        payload,
      );
      console.log("✅ Review created successfully");
      return response;
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
      console.log("💬 Replying to review:", reviewId, payload);
      const response = await this.post<{ reply: ReviewReply }>(
        `/api/reviews/${reviewId}/reply`,
        payload,
      );
      console.log("✅ Reply posted successfully");
      return response;
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
      console.log("👍 Liking review:", reviewId);
      const response = await this.post<{ message: string; likes: number }>(
        `/api/reviews/${reviewId}/like`,
      );
      console.log("✅ Review liked successfully");
      return response;
    } catch (error) {
      console.error("Error liking review:", error);
      throw error;
    }
  }

  /**
   * Test the API endpoint directly (for debugging)
   */
  static async testApiEndpoint(): Promise<void> {
    const testURL = `${this.baseURL}/api/reviews`;
    console.log("🧪 Testing API endpoint directly:", testURL);

    try {
      const response = await fetch(testURL, {
        method: "GET",
        headers: this.buildHeaders(),
      });

      console.log("🧪 Direct test results:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log("   OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("   Error Body:", errorText);
      } else {
        const data = await response.json();
        console.log("   Success Data:", data);
      }
    } catch (error) {
      console.error("🧪 Direct test failed:", error);
    }
  }

  /**
   * Check if backend is reachable
   */
  static async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(this.baseURL);
      console.log("🏥 Backend health check:");
      console.log("   URL:", this.baseURL);
      console.log("   Status:", response.status);
      console.log("   OK:", response.ok);
      return response.ok;
    } catch (error) {
      console.error("🏥 Backend health check failed:", error);
      return false;
    }
  }

  /**
   * Set authentication token
   */
  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  /**
   * Clear authentication token
   */
  static clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }
}
