export type SessionData = {
  name: string;
  email: string;
  token: string;
  loginExpiry: number;
  roles: string[];
  activeRole: string | null;
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const setUserSession = (user: {
  email: string;
  name: string;
  token: string;
  roles?: string[];
  activeRole?: string | null;
}) => {
  const session: SessionData = {
    email: user.email,
    name: user.name,
    token: user.token,
    loginExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
    roles: user.roles || [], // Default to empty array for new users
    activeRole: user.activeRole || null, // No default role
  };
  localStorage.setItem("session", JSON.stringify(session));
  localStorage.setItem("authToken", user.token);
  if(user.activeRole) {
    localStorage.setItem("userRole", user.activeRole);
  }
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
};

export const saveLoginSession = (userData: SessionData) => {
  localStorage.setItem("authToken", userData.token);
  localStorage.setItem("session", JSON.stringify(userData));
};

type UserSessionWithToken = SessionData & { authToken: string | null };

export const getLoggedInUser = (): UserSessionWithToken | null => {
  if (typeof window === "undefined") return null;

  const session = localStorage.getItem("session");
  if (!session) return null;

  const parsedSession = JSON.parse(session) as SessionData;

  if (Date.now() > parsedSession.loginExpiry) {
    logoutUser();
    return null;
  }

  const authToken = getAuthToken();

  return {
    ...parsedSession,
    authToken,
  };
};

export const isUserLoggedIn = (): boolean => {
  try {
    const session = localStorage.getItem("session");
    if (!session) return false;

    const parsed = JSON.parse(session) as SessionData;

    const isValid = Date.now() < parsed.loginExpiry;
    if (!isValid) logoutUser();

    return isValid;
  } catch {
    return false;
  }
};
