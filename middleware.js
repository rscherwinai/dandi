export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboards/:path*", "/api/protected/:path*"],
}; 