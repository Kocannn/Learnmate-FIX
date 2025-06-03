import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory store for rate limiting
const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  store: new Map<string, { count: number; resetTime: number }>()
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting only to API routes
  if (pathname.startsWith('/api/v1')) {
    const ip = request.ip ?? '127.0.0.1';
    const now = Date.now();
    const currentRecord = rateLimit.store.get(ip) || { count: 0, resetTime: now + rateLimit.windowMs };

    // Reset count if window has elapsed
    if (now > currentRecord.resetTime) {
      currentRecord.count = 1;
      currentRecord.resetTime = now + rateLimit.windowMs;
    } else {
      // Increment request count
      currentRecord.count++;
    }

    rateLimit.store.set(ip, currentRecord);

    // Return rate limit exceeded response if over limit
    if (currentRecord.count > rateLimit.max) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Rate limit exceeded. Please try again later.'
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimit.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(currentRecord.resetTime / 1000).toString()
        }
      });
    }
  }

  // Auth check only for dashboard routes
  if (pathname.startsWith('/dashboard/')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If not logged in, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(loginUrl);
    }

    // Fix type issue with hasCompletedOnboarding property
    const userToken = token as { user?: { hasCompletedOnboarding?: boolean } };

    if (userToken?.user?.hasCompletedOnboarding === false) {
      const onboardingUrl = new URL("/onboarding", request.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
  runtime: "nodejs",
};
