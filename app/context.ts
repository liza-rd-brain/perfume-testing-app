// app/context.ts
import { createContext } from "react";

export interface User {
  id: string;
  name: string;
}

export const userContext = createContext<User | null>(null);