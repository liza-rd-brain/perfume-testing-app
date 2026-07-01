// ✅ ПРАВИЛЬНО
import { type RouteConfig } from "@react-router/dev/routes";

const routes: RouteConfig = [
    {
        path: "/",
        file: "routes/_index.tsx",
    },
];

export default routes; // 👈 ВАЖНО: default export!