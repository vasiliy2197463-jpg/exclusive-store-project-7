import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ru", "tm"];

export async function middleware(request: NextRequest) {
  // ! handling localization
  const { pathname } = request.nextUrl;
  const locale = locales.find(
    (item) => pathname.startsWith(`/${item}/`) || pathname === `/${item}`
  );

  if (locale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("locale", locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  request.nextUrl.pathname = `/${locales[0]}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
