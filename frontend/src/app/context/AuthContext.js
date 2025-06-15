"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // باش نسترجعو token من localStorage إذا موجود فالبداية
  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    console.log("Loaded token from localStorage:", savedToken);
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("jwtToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
