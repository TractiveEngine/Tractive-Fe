"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type UserEmailContextType = {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
};

const UserEmailContext = createContext<UserEmailContextType | undefined>(
  undefined
);

export const UserEmailProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("userEmail");
    if (stored) {
      setEmail(stored);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (email) {
      localStorage.setItem("userEmail", email);
    }
  }, [email]);

  return (
    <UserEmailContext.Provider value={{ email, setEmail, loading }}>
      {children}
    </UserEmailContext.Provider>
  );
};

export const useEmailUser = () => {
  const context = useContext(UserEmailContext);
  if (!context) {
    throw new Error("useEmailUser must be used within a UserEmailProvider");
  }
  return context;
};
