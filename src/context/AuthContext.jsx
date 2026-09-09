import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  // Check and verify existing token on app load
  useEffect(() => {
    async function verifyUser() {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/auth/me");
        if (response.success && response.user) {
          setUser(response.user);
          setToken(savedToken);
        } else {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.warn("Session expired or server unavailable:", error.message);
        // Only clear token if server explicitly rejected auth (401/403)
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    verifyUser();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUser(response.user);
        toast.success(response.message || "Welcome back!");
        return { success: true, user: response.user };
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      toast.error(error.message || "Failed to log in");
      throw error;
    }
  }, []);

  const register = useCallback(async (name, email, password, confirmPassword) => {
    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setUser(response.user);
        toast.success(response.message || "Account created successfully!");
        return { success: true, user: response.user };
      }
      throw new Error(response.message || "Registration failed");
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      toast.info("You have been logged out");
    }
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
