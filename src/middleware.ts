import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "./app/_actions/config-actions";

const PROTECTED_ROUTES = [
  // '/dashboard',
  // '/settings',
  // '/dashboard/profile',
  // '/dashboard/payments/',
  // '/dashboard/payments/direct',
  // Add more protected routes as needed
];

const PUBLIC_ROUTE = ["/", "/login", "/auth/register", "/support"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone(); // REQUIRED FOR BASE ABSOLUTE URL
  const response = NextResponse.next();

  const { session } = await getAuthSession();
  const accessToken = session?.accessToken || "";

  // CHECK FOR ROUTES
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/auth/register");

  const isPublicRoute = PUBLIC_ROUTE.includes(pathname);

  // if (pathname == "/") return response;
  // if (isPublicRoute && !accessToken) return response;

  // // IF NO ACCESS TOKEN AT ALL>>> REDIRECT BACK TO AUTH PAGE
  // if (!accessToken && !isPublicRoute) {
  //   url.pathname = "/";
  //   url.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(url);
  // }

  // // IF THERE IS AN ACCESS TOKEN EXISTS - REDIRECT TO DASHBOARD
  // if (accessToken && isAuthPage) {
  //   url.pathname = `/`;
  //   return NextResponse.redirect(url);
  // }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
