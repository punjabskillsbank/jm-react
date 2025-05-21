// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: "client" | "freelancer" | null;
  email: string | null;
  setAuthData: (data: { token: string; role: string; email: string }) => void;
  loginAsMockUser: (data: { token: string; role: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"client" | "freelancer" | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const setAuthData = ({ token, role, email }: { token: string; role: string; email: string }) => {
    setToken(token);
    setRole(role as "client" | "freelancer");
    setEmail(email);
  };

  const loginAsMockUser = ({ token, role, email }: { token: string; role: string; email: string }) => {
    setToken(token);
    setRole(role as "client" | "freelancer");
    setEmail(email);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, email, setAuthData, loginAsMockUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
