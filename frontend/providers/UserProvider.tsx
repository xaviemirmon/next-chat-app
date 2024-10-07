"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the User Context
interface UserContextType {
  user: number | null;
  updateUser: (newUserData: React.SetStateAction<number | null>) => void;
  logoutUser: () => void;
}

// Create the context with the defined type
const UserContext = createContext<UserContextType | null>(null);

// Custom hook to access the User Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Define the state that holds the current user data
  const [user, setUser] = useState<number | null>(null);

  // Function to update user (e.g., after login)
  const updateUser = (newUserData: React.SetStateAction<number | null>) => {
    setUser(newUserData);
  };

  // Function to log out user
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
