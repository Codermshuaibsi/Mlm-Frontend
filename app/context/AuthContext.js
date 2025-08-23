"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Start as null
  const [mounted, setMounted] = useState(false);  // Track hydration

  // Load userData from localStorage only after client mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    setUserData(storedUser ? JSON.parse(storedUser) : null);
    setMounted(true);
  }, []);

  // Keep syncing changes to localStorage
  useEffect(() => {
    if (!mounted) return; // prevent SSR mismatch
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData, mounted]);

  // 🚨 Important: render nothing until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
