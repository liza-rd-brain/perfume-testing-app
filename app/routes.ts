// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";

export default [
    {
        path: "/login",
        file: "routes/login.tsx",
    },
    {
        path: "/",
        file: "routes/_protected.tsx", // 🔒 Защищенный layout
        children: [
            {
                index: true,
                file: "routes/_index.tsx",
            },
            {
                path: "tutorial",
                file: "routes/tutorial.tsx",
            },
            {
                path: "testing/:id",
                file: "routes/testing.tsx",
            },
            {
                path: "description/:id",
                file: "routes/description.tsx",
            },
            {
                path: "result/:id",
                file: "routes/result.tsx",
            },
            {
                path: "summary/:id",
                file: "routes/summary.tsx",
            },
        ],
    },
] satisfies RouteConfig;