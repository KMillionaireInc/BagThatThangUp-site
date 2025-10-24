import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Detect subdomain
  const match = hostname.match(/^([a-z0-9-]+)\.bagthatthangup\.com$/i);
  if (match) {
    url.pathname = "/tenant/index.html";
    return NextResponse.rewrite(url);
  }

  // Onboarding and Success routes
  if (url.pathname.startsWith("/onboarding")) {
    url.pathname = "/onboarding/index.html";
    return NextResponse.rewrite(url);
  }

  if (url.pathname.startsWith("/success")) {
    url.pathname = "/success/index.html";
    return NextResponse.rewrite(url);
  }

  // Default: main landing page
  url.pathname = "/index.html";
  return NextResponse.rewrite(url);
}
