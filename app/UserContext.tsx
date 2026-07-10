import { createContext, useContext } from "react";

export const UserContext = createContext<any>(null);

export function useUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return user;
}
