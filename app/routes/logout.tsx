// app/routes/logout.ts
import { redirect } from "react-router";
import { getSession, destroySession } from "~/lib/session.server";

export async function action({ request }: { request: Request }) {
  const session = await getSession(request.headers.get("Cookie"));

  const headers = await destroySession(session);

  return redirect("/login", {
    headers: {
      "Set-Cookie": headers,
    },
  });
}
