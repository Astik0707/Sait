import { NextRequest, NextResponse } from "next/server";
import { createToken, validateCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Логин и пароль обязательны" },
        { status: 400 }
      );
    }

    // Логирование для отладки (только в development или если есть ошибка)
    const hasEnvVars = !!(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
    if (process.env.NODE_ENV === "development" || !hasEnvVars) {
      console.log("Login attempt:", {
        hasEnvUsername: !!process.env.ADMIN_USERNAME,
        hasEnvPassword: !!process.env.ADMIN_PASSWORD,
        envUsername: process.env.ADMIN_USERNAME || "not set",
        providedUsername: username,
      });
    }

    if (!validateCredentials(username, password)) {
      console.error("Invalid credentials:", {
        providedUsername: username,
        expectedUsername: process.env.ADMIN_USERNAME || "admin (default)",
        hasPassword: !!password,
      });
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

    const token = await createToken(username);

    const response = NextResponse.json({ success: true });

    // Устанавливаем HTTP-only cookie
    // В Railway всегда используем secure=true для HTTPS
    const isProduction = process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT === "production";
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: isProduction, // true для HTTPS в production
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 часа
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

