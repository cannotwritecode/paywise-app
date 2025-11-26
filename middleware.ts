import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public paths that don't require authentication
        const publicPaths = [
          "/",
          "/compare",
          "/scan-receipt",
          "/add-price",
          "/auth/signin",
          "/auth/signup",
          "/auth/error",
        ];
        
        // Check if current path is public
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true;
        }
        
        // Protected paths require a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)",
  ],
};
