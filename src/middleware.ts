import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production"
);

// Защищённые маршруты
const protectedRoutes = ["/admin"];
const publicRoutes = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Пропускаем публичные маршруты
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Проверяем защищённые маршруты
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Токен невалидный — перенаправляем на логин
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

