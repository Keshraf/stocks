import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env/server.mjs";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default async function middleware(
  request: NextRequest,
  response: NextResponse
) {
  const path = request.nextUrl.pathname;

  if (
    path.includes("/stocks") ||
    path.includes(
      "/upload" ||
        path.includes("/orders") ||
        path.includes("/clients") ||
        path.includes("/analytics")
    )
  ) {
    const token = request.cookies.get("STOCKS_ACCESS_TOKEN")?.value;
    if (token === undefined) {
      return NextResponse.redirect(`${getBaseUrl()}/`);
    }
  }

  if (path === "/") {
    const token = request.cookies.get("STOCKS_ACCESS_TOKEN")?.value;
    if (token !== undefined) {
      return NextResponse.redirect(`${getBaseUrl()}/stocks`);
    }
  }

  return NextResponse.next();
}
