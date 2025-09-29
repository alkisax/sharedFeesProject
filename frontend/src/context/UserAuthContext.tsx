// src/context/UserAuthContext.tsx
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import type { ReactNode } from "react";
import type { BackendJwtPayload } from "../types/auth.types";
import type { UserView } from "../types/auth.types"; 

export interface UserAuthContextType {
  user: UserView | null;
  setUser: (u: UserView | null) => void;
  isLoading: boolean;
  setIsLoading: (b: boolean) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

// createContext needs an initial value. () => {} for initial function
export const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  setIsLoading: () => {},
  refreshUser: async () => {},
  logout: () => {}
});

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserView | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<BackendJwtPayload>(token);

    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${decoded.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

      setUser({
        id: res.data.data.id,
        username: res.data.data.username,
        firstname: res.data.data.firstname,
        lastname: res.data.data.lastname,
        email: res.data.data.email,
        phone: res.data.data.phone,
        AFM: res.data.data.AFM,
        building: res.data.data.building,
        flat: res.data.data.flat,
        balance: res.data.data.balance,
        lastClearedMonth: res.data.data.lastClearedMonth,
        notes: res.data.data.notes,
        uploadsMongo: res.data.data.uploadsMongo,
        uploadsAppwrite: res.data.data.uploadsAppwrite,
        roles: res.data.data.roles,
        hasPassword: res.data.data.hasPassword,
        createdAt: res.data.data.createdAt,
        updatedAt: res.data.data.updatedAt,
      });

    } catch (err) {
      console.error("Invalid token, clearing:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);

    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );

      if (res.data.status) {
        const newToken = res.data.data.token;
        localStorage.setItem("token", newToken);

        await fetchUser();

      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
      localStorage.removeItem("token");
      setUser(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{ logout, user, setUser, isLoading, setIsLoading, refreshUser }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
