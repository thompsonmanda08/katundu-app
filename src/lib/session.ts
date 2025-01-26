import "server-only";

import { SignJWT, jwtVerify, decodeJwt, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_SESSION } from "./constants";
import { User } from "./types";

export type SessionPayload = {
  user?: Partial<User> & {
    [x: string]: any;
  };

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
  accessToken,
}: {
  user?: Partial<User>;
  accessToken: string;
}) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 23); // AFTER 23 HOURS
  const session = await encrypt({
    user,
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

export async function verifySession(): Promise<{
  isAuthenticated: boolean;
  session: SessionPayload | null;
}> {
  const cookie = (await cookies()).get(AUTH_SESSION)?.value;

  if (!cookie) return { isAuthenticated: false, session: null };

  const session = await decrypt(cookie);

  if (!session?.accessToken || !session?.user) {
    return { isAuthenticated: false, session: null };
  }

  const accessToken = String(session?.accessToken) || "";
  const config = decodeJwt(accessToken);

  return {
    isAuthenticated: true,
    session: {
      ...session,
      accessToken: accessToken,
      user: {
        ...session.user,
        role: config?.role,
        id: String(config?.jti),
      },
    } as SessionPayload,
  };
}

export async function updateSession(fields: any) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 23); // AFTER 23 HOURS
  const { isAuthenticated, session: oldSession } = await verifySession();

  if (!isAuthenticated) redirect("/login");

  if (oldSession) {
    const session = await encrypt({
      ...oldSession,
      ...fields,
    });

    if (session) {
      (await cookies()).set(AUTH_SESSION, session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
      });
    } else {
      throw new Error("Failed to update session token.");
    }
  }
}

export async function deleteSession() {
  (await cookies()).delete(AUTH_SESSION);
  (await cookies()).delete("theme");
  redirect("/auth");
}
