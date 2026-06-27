import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Server-side route protection.
 *
 * Runs at the edge before any protected page renders, so unauthorized HTML
 * never ships to the browser (the client-side `useRoleGuard` only hides the UI
 * after the protected bundle has already loaded).
 *
 * Gating model mirrors `useRoleGuard`:
 *  - no token            → redirect to /login (handled by `authorized` callback)
 *  - token, no activeRole → redirect to /register-as
 *  - token, wrong role    → redirect to the user's own dashboard
 */
const ROLE_PREFIXES = ["admin", "agent", "transporter", "buyer"] as const;
type RolePrefix = (typeof ROLE_PREFIXES)[number];

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const segment = req.nextUrl.pathname.split("/")[1];
    const requiredRole = ROLE_PREFIXES.find((r) => r === segment) as
      | RolePrefix
      | undefined;

    // Not a role-gated route — nothing to enforce.
    if (!requiredRole) return NextResponse.next();

    const activeRole = token?.activeRole as string | null | undefined;

    // Authenticated but hasn't chosen a role yet.
    if (!activeRole) {
      return NextResponse.redirect(new URL("/register-as", req.url));
    }

    // Authenticated as a different role — bounce to their own dashboard.
    if (activeRole !== requiredRole) {
      return NextResponse.redirect(new URL(`/${activeRole}`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Token-presence gate. Returning false redirects to `pages.signIn`
      // (with a callbackUrl), so unauthenticated users hit /login server-side.
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/agent/:path*",
    "/transporter/:path*",
    "/buyer/:path*",
  ],
};
