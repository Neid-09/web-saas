import { NextResponse, type NextRequest } from "next/server";
import { AUTH_TOKEN_KEY } from "@/shared/config/cookie-keys";

const matches = (path: string, prefix: string) =>
	path === prefix || path.startsWith(prefix + "/");

const PUBLIC = ["/login", "/forbidden"];

export function proxy(req: NextRequest) {
	const { pathname, search } = req.nextUrl;
	const hasToken = Boolean(req.cookies.get(AUTH_TOKEN_KEY)?.value);
	const isPublic = PUBLIC.some((p) => matches(pathname, p));

	if (!hasToken && !isPublic) {
		const url = new URL("/login", req.url);
		if (pathname !== "/") {
			url.searchParams.set("redirect", pathname + search);
		}
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
