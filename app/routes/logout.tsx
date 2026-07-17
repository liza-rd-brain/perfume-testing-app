// app/routes/logout.ts
import { redirect } from "react-router";
import { getSession, destroySession } from "~/lib/session.server";

export async function action({ request }: { request: Request }) {
  console.log("🔴 logout action вызван");

  const session = await getSession(request.headers.get("Cookie"));
  console.log("🔴 session:", session.get("userId"));

  const headers = await destroySession(session);
  console.log("🔴 headers:", headers);

  return redirect("/login", {
    headers: {
      "Set-Cookie": headers,
    },
  });
}
