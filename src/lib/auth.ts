import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production"
);

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin").trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "admin123").trim();

export interface AuthPayload {
  username: string;
  role: "admin";
  iat: number;
  exp: number;
}

// Создание JWT токена
export async function createToken(username: string): Promise<string> {
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

// Проверка JWT токена
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Валидация структуры payload
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'username' in payload &&
      'role' in payload &&
      'iat' in payload &&
      'exp' in payload &&
      typeof payload.username === 'string' &&
      payload.role === 'admin' &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    ) {
      return {
        username: payload.username,
        role: 'admin',
        iat: payload.iat,
        exp: payload.exp,
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

// Проверка учётных данных
export function validateCredentials(username: string, password: string): boolean {
  const usernameMatch = username.trim() === ADMIN_USERNAME;
  const passwordMatch = password === ADMIN_PASSWORD;
  
  // Логирование для отладки (только в development)
  if (process.env.NODE_ENV === "development") {
    console.log("Auth attempt:", {
      providedUsername: username.trim(),
      expectedUsername: ADMIN_USERNAME,
      usernameMatch,
      passwordMatch: password === ADMIN_PASSWORD ? "✓" : "✗",
      hasEnvUsername: !!process.env.ADMIN_USERNAME,
      hasEnvPassword: !!process.env.ADMIN_PASSWORD,
    });
  }
  
  return usernameMatch && passwordMatch;
}

// Получение токена из cookies
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  return token?.value || null;
}

// Проверка авторизации
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookies();
  if (!token) return false;

  const payload = await verifyToken(token);
  return payload !== null;
}

// Получение данных пользователя
export async function getUser(): Promise<AuthPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;

  return verifyToken(token);
}

