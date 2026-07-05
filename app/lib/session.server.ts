// app/lib/session.server.ts
import { createCookieSessionStorage } from "react-router";
// app/lib/session.server.ts
import { redirect } from "react-router"; // ← добавить redirect
import { supabase } from './supabase';

// Храним сессию в cookie
const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: "/",
        sameSite: "lax",
        secrets: [process.env.SESSION_SECRET || "default-secret"],
        secure: process.env.NODE_ENV === "production",
    },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

// Получить userId из сессии
export async function getUserId(request: Request): Promise<string | null> {
    const session = await getSession(request.headers.get("Cookie"));
    return session.get("userId") || null;
}


// Получить userId из сессии
export async function getIsTutorialDone(request: Request): Promise<string | null> {
    const session = await getSession(request.headers.get("Cookie"));
    return session.get("tutorialSkipped") || null;
}

export async function getUserById(userId: string) {
    const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .eq("id", userId)
        .single();

    if (error || !data) return null;
    return data;
}

// ✅ И эту, если нужна для логина
export async function verifyPassword(password: string) {
    const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .eq("password", password)
        .maybeSingle();

    if (error || !data) return null;
    return data;
}



/* сохраняем юзера в куках */
export async function createUserSession(userId: string, redirectTo: string) {
    const session = await getSession();
    session.set("userId", userId);

    // ✅ Используем redirect() из react-router
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}




/* сохраняем юзера в куках */
export async function createUserDoneTutorial(redirectTo: string) {
    const session = await getSession();
    session.set("tutorialSkipped", true);

    // ✅ Используем redirect() из react-router
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}



// Удалить сессию (выход)
export async function logout(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}

