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

const PUBLIC_ROUTE = ["/auth", "/support"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone(); // REQUIRED FOR BASE ABSOLUTE URL
  const response = NextResponse.next();

  const { session } = await getAuthSession();
  const accessToken = session?.accessToken || "";

  // CHECK FOR ROUTES
  const isAuthPage = pathname.startsWith("/auth");

  const isPublicRoute = PUBLIC_ROUTE.includes(pathname);

  // RESTRICT ACCESS TO ALL AUTH ROUTES WHILE ACCESS TOKEN IS STILL VALID
  if (accessToken && isAuthPage) {
    url.pathname = `/`;
    return NextResponse.redirect(url);
  }

  // RESTRICT ACCESS TO ALL PROTECTED ROUTES WHERE ACCESS TOKEN IS REQUIRED
  if (!accessToken && !isPublicRoute) {
    url.pathname = `/auth`;
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
