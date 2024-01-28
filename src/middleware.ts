import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  adminRoutes,
  apiAuthPrefix,
  authRoutes,
  protectedRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const session = await auth();
  console.log({ session: session?.user, req: req.auth });

  const role = req.auth?.user.role || "";

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    if (isAuthenticated) {
      // si accede al login con una sesion activa lo sacamos
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (isProtectedRoute && !isAuthenticated) {
    const requestedRoute = req.nextUrl.pathname;

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${requestedRoute}`, nextUrl)
    );
  }

  if (isProtectedRoute && isAuthenticated) {
    if (isAdminRoute && role !== "admin") {
      return Response.redirect(new URL("/403", nextUrl));
    }

    return null;
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
