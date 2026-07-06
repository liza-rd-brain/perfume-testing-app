// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";

export default [
    {
        path: "/",
        file: "routes/_index.tsx",
    },
    {
        path: "/tutorial",
        file: "routes/tutorial.tsx",
    },
    {
        path: "/login",
        file: "routes/login.tsx",
    },
    {
        path: "/testing/:id",
        file: "routes/testing.tsx",
    },



] satisfies RouteConfig;