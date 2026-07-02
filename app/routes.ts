// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";

export default [
    {
        path: "/",
        file: "routes/_index.tsx",
    },
    {
        path: "/login",
        file: "routes/login.tsx",
    },

] satisfies RouteConfig;