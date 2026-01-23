// Singleton to manage the access token in memory
// preventing the need to access the session (cookies) for every request

class TokenManager {
  private accessToken: string | null = null;
  private refreshTokenPromise: Promise<string | null> | null = null;

  getToken(): string | null {
    return this.accessToken;
  }

  setToken(token: string | null) {
    this.accessToken = token;
  }

  clearToken() {
    this.accessToken = null;
    this.refreshTokenPromise = null;
  }

  // Deduplicates refresh calls
  async getRefreshTokenHelper(
    refreshFn: () => Promise<string | null>,
  ): Promise<string | null> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = refreshFn().finally(() => {
      this.refreshTokenPromise = null;
    });

    return this.refreshTokenPromise;
  }
}

export const tokenManager = new TokenManager();
