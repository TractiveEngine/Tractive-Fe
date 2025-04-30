type StoredUser = {
  fullName: string;
  email: string;
  password: string;
};

type SessionData = {
  fullName: string;
  email: string;
  password: string;
  loginExpiry: number;
};

// Get stored user from localStorage
export const getStoredUser = (): StoredUser | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// Get the auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Set session after successful login
export const setUserSession = (user: {
  email: string;
  password: string;
  fullName: string;
}) => {
  const session: SessionData = {
    email: user.email,
    fullName: user.fullName,
    password: user.password,
    loginExpiry: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  };
  localStorage.setItem("session", JSON.stringify(session));
};

// Logout and clear session
export const logoutUser = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("authToken");
};

// Get session if still valid
export const getLoggedInUser = (): SessionData | null => {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem("session");
  if (!session) return null;

  const parsedSession = JSON.parse(session) as SessionData;
  if (Date.now() > parsedSession.loginExpiry) {
    logoutUser();
    return null;
  }
  return parsedSession;
};
