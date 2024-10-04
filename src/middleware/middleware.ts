import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./services/AuthService";

const authRoutes = ["/login", "/register"];

const roleBasedRoutes = {
  USER: [/^\/profile/],
  ADMIN: [/^\/admin/],
};
type TRole = keyof typeof roleBasedRoutes;

async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getCurrentUser();
  if (!user) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (user?.role && roleBasedRoutes[user.role as TRole]) {
    const routes = roleBasedRoutes[user.role as TRole];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile", "/profile/:page*", "/admin", "/login", "/register"],
};

export default middleware;
