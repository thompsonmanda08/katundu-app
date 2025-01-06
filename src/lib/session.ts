import "server-only";

import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_SESSION } from "./constants";
import { User } from "./types";

export type SessionPayload = {
  user?: Partial<User>;
  role?: string;
  accessToken: string;
  expiresAt?: Date;
};

const secretKey =
  process.env.NEXT_PUBLIC_AUTH_SECRET || process.env.AUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24hr")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}

export async function createAuthSession({
  user,
  role,
  accessToken,
}: {
  user?: Partial<User>;
  role?: string;
  accessToken?: string;
}) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 23); // AFTER 23 HOURS
  const session = await encrypt({
    user,
    role,
    accessToken: accessToken || "",
  });

  (await cookies()).set(AUTH_SESSION, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookie = (await cookies()).get(AUTH_SESSION)?.value;

  if (!cookie) return { isAuthenticated: false, session: null };

  const session = await decrypt(cookie);

  if (!session?.accessToken || !session?.user) {
    return { isAuthenticated: false, session: null };
  }

  const { accessToken } = session || "";
  const user = decodeJwt(accessToken as string);

  return { isAuthenticated: true, session, user };
}

export async function updateSession() {
  const session = (await cookies()).get(AUTH_SESSION)?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 60 * 60 * 1000 * 23); // AFTER 23 HOURS
  (await cookies()).set(AUTH_SESSION, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete(AUTH_SESSION);
  (await cookies()).delete("theme");
  redirect("/");
}
