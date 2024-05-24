import React, { ReactNode, createContext, useState } from 'react';
import jwt_decode from "jwt-decode";

interface User {
  sub: string;
  scope: string;
}

interface DecodedToken {
  sub: string;
  scope: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  role: string | null; 
  handleLogin: (token: string) => void; 
  handleLogout: () => void;
  isLoggedIn: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null, 
  handleLogin: () => { },
  handleLogout: () => { },
  isLoggedIn: () => false,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); 

  const handleLogin = (token: string) => {
    try {
      const decodedToken: DecodedToken = jwt_decode(token);

        localStorage.setItem("userId", decodedToken.sub);
        localStorage.setItem("userRole", decodedToken.scope);
        localStorage.setItem("token", token);
        setUser(decodedToken);
        setRole(decodedToken.scope); 
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null); 
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    try {
      const decodedToken: DecodedToken = jwt_decode(token);
      const isExpired = Date.now() >= decodedToken.exp * 1000;
      return !isExpired;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, handleLogin, handleLogout, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

