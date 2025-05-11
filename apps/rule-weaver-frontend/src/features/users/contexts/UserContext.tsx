import React, { createContext, useContext, useEffect, useState } from "react";
import { CurrentUser, User } from "../types/user";
import { userService } from "../services/userService";

interface UserContextType {
  currentUser: CurrentUser;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: false,
  error: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user")
        );
        console.error("Error fetching current user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
