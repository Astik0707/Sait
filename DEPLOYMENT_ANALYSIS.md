# Pach Group — Deployment & Runtime Analysis

## Repo Architecture Summary

**Pach Group** is a Next.js 14.2.35 App Router real estate website with hybrid rendering: server-rendered root layout for SEO, client components for interactivity. Data layer uses optional Supabase (PostgreSQL) with fallback to static `src/data/mock.ts` imported at build time. Authentication via JWT (jose) stored in HTTP-only cookies, protected by middleware at `src/middleware.ts`. API routes handle auth (`/api/auth/*`) and contact form (`/api/contact` → Telegram Bot API). Deployment configured for Netlify with `@netlify/plugin-nextjs`, but cookie security logic references Railway environment variables. Properties are fetched at runtime via `/api/properties` (returns empty array if Supabase missing, no mock fallback), causing empty listings when database not configured.

---

## Key Files (Runtime Behavior)

### Configuration
- `next.config.mjs` — Image remote patterns (only Unsplash), no output/experimental flags
- `netlify.toml` — Build: `npm run build`, Publish: `.next`, Plugin: `@netlify/plugin-nextjs`
- `package.json` — Scripts: `dev`, `build`, `start`, `lint`; Next.js 14.2.35, React 18.3.1
- `tsconfig.json` — Path alias `@/*` → `./src/*`, strict mode enabled

### Middleware & Auth
- `src/middleware.ts` — Protects `/admin/*` (except `/admin/login`), reads `auth_token` cookie, verifies JWT, redirects to login if invalid
- `src/lib/auth.ts` — JWT creation/verification, credential validation, cookie helpers; JWT_SECRET fallback: `"default-secret-change-in-production"`
- `src/app/api/auth/login/route.ts` — POST handler: validates credentials, creates JWT, sets cookie with `secure: isProduction` (checks `NODE_ENV` + `RAILWAY_ENVIRONMENT`)
- `src/app/api/auth/check/route.ts` — GET handler: reads cookie, verifies token, returns user data
- `src/app/api/auth/logout/route.ts` — POST handler: deletes cookie (uses `NODE_ENV` only for `secure`)

### Data Layer
- `src/data/mock.ts` — Static TypeScript exports: `properties[]`, `deals[]`, `testimonials[]`; imported at build time
- `src/lib/supabase.ts` — Creates Supabase clients (anon + service role) if env vars present, exports `null` otherwise
- `src/lib/properties.ts` — Client helper: `getProperties()` fetches `/api/properties`, returns empty array on error (no mock fallback)
- `src/app/api/properties/route.ts` — GET: queries Supabase, returns empty array if not configured; POST/DELETE: require auth cookie

### Components & Pages
- `src/app/layout.tsx` — Root layout (server component), SEO metadata, fonts
- `src/app/page.tsx` — Home page (server component), composes all sections
- `src/components/Listings.tsx` — Client component: `useEffect` calls `getProperties()`, displays loading/empty states
- `src/app/admin/login/page.tsx` — Client login form, POSTs to `/api/auth/login`, redirects on success
- `src/app/admin/page.tsx` — Client admin dashboard, checks auth via `/api/auth/check` on mount

### API Routes
- `src/app/api/contact/route.ts` — POST: validates name/phone, sends Telegram message(s), no timeout handling, returns 500 if all chats fail

### Environment Variables (26 references)
- `JWT_SECRET` — Required (fallback: insecure default)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` — Required (fallbacks: "admin", "admin123")
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — Required for contact form
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Optional (fallback: null client)
- `SUPABASE_SERVICE_ROLE_KEY` — Optional (required for POST/DELETE properties)
- `NEXT_PUBLIC_SITE_URL` — Optional (fallback: "http://localhost:3000")
- `NODE_ENV` — Auto-set by Next.js/Netlify
- `RAILWAY_ENVIRONMENT` — Referenced in login route (not Netlify)
- `DGIS_API_KEY`, `DGIS_BRANCH_ID`, `NEXT_PUBLIC_DGIS_REVIEWS_URL` — Optional (2GIS integration)

---

## Execution Traces

### PHASE 1: Deployment Reality Check (Netlify)

#### Netlify Build Setup
- **Config**: `netlify.toml` → `build.command = "npm run build"`, `publish = ".next"`
- **Plugin**: `@netlify/plugin-nextjs` (handles SSR, API routes, static optimization)
- **Node Version**: Not specified (Netlify default: Node 18.x)
- **Build Output**: `.next/` directory (Next.js standard)

#### Netlify-Specific Pitfalls Identified

1. **Cookie Security Flag Mismatch** (HIGH PRIORITY)
   - **Location**: `src/app/api/auth/login/route.ts:44`
   - **Issue**: Checks `RAILWAY_ENVIRONMENT === "production"` (Railway-specific, not Netlify)
   - **Impact**: On Netlify, `secure: true` only if `NODE_ENV === "production"` (correct), but code references wrong platform
   - **Verification**: Check Netlify function logs for cookie setting; test on preview deploy (should work if `NODE_ENV=production`)

2. **Middleware Runtime** (MEDIUM PRIORITY)
   - **Location**: `src/middleware.ts`
   - **Issue**: Next.js middleware runs on Edge runtime by default on Netlify
   - **Impact**: `jwtVerify` from `jose` should work on Edge, but verify timeout limits
   - **Verification**: Test `/admin` access with valid/invalid cookies on Netlify preview

3. **Environment Variables Availability**
   - **Build-time**: `NEXT_PUBLIC_*` vars available (baked into bundle)
   - **Runtime**: Server-side vars (`JWT_SECRET`, `TELEGRAM_*`, `SUPABASE_SERVICE_ROLE_KEY`) must be set in Netlify dashboard
   - **Issue**: No validation that required vars exist at runtime
   - **Verification**: Check Netlify function logs for "Telegram credentials not configured" or JWT errors

4. **Image Remote Patterns**
   - **Location**: `next.config.mjs:4-9`
   - **Current**: Only `images.unsplash.com` allowed
   - **Impact**: If Supabase stores image URLs, they won't load unless added to `remotePatterns`
   - **Verification**: Check browser console for Next.js Image domain errors

#### Local Parity Checklist
- [ ] Run `npm run build` locally → verify `.next/` created
- [ ] Set `NODE_ENV=production` → test cookie `secure` flag (should be `true`)
- [ ] Test middleware redirects: visit `/admin` without cookie → should redirect to `/admin/login`
- [ ] Test login flow: POST `/api/auth/login` → verify cookie set with `httpOnly: true, secure: true, sameSite: "lax"`
- [ ] Test `/api/properties` without Supabase vars → should return `[]`
- [ ] Test `/api/contact` without Telegram vars → should return 500 error

---

### PHASE 2: Auth & Middleware Trace

#### Login Flow End-to-End

**Step 1: Client Submit** (`src/app/admin/login/page.tsx:19-23`)
- POST `/api/auth/login` with `{ username, password }`
- Headers: `Content-Type: application/json`

**Step 2: Route Handler** (`src/app/api/auth/login/route.ts:4-61`)
- Validates `username` and `password` present (400 if missing)
- Calls `validateCredentials()` from `src/lib/auth.ts:62`
  - Compares against `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars (trimmed)
  - Returns 401 if mismatch
- Creates JWT via `createToken()` (`src/lib/auth.ts:19`)
  - Claims: `{ username, role: "admin" }`
  - Expiration: 24h
  - Algorithm: HS256
- Sets cookie: `auth_token = <JWT>`
  - Options: `httpOnly: true, secure: isProduction, sameSite: "lax", maxAge: 86400, path: "/"`
  - **BUG**: `isProduction` checks `RAILWAY_ENVIRONMENT` (line 44) — should check Netlify or use `NODE_ENV` only

**Step 3: Client Redirect** (`src/app/admin/login/page.tsx:28`)
- `router.push("/admin")` on success

**Step 4: Middleware Intercept** (`src/middleware.ts:12-40`)
- Matcher: `/admin/:path*` (line 43)
- Reads `auth_token` cookie (line 22)
- If missing → redirect to `/admin/login` (line 25)
- If present → verifies JWT with `jwtVerify()` (line 29)
  - Uses `JWT_SECRET` from env (fallback: insecure default)
- If invalid → redirects to `/admin/login`, deletes cookie (line 33-35)
- If valid → `NextResponse.next()` (line 30)

#### Cookie Security Flags Analysis

**Login Route** (`src/app/api/auth/login/route.ts:45-51`):
```typescript
secure: isProduction, // isProduction = NODE_ENV === "production" || RAILWAY_ENVIRONMENT === "production"
sameSite: "lax",
httpOnly: true,
maxAge: 60 * 60 * 24,
path: "/"
```

**Logout Route** (`src/app/api/auth/logout/route.ts:9`):
```typescript
secure: process.env.NODE_ENV === "production", // Different logic!
sameSite: "lax",
httpOnly: true,
maxAge: 0,
path: "/"
```

**Issues**:
1. **Inconsistent `secure` logic**: Login checks Railway, logout checks `NODE_ENV` only
2. **Netlify preview deploys**: `NODE_ENV` may be `production` on preview, but domain is `*.netlify.app` (HTTPS) — should work
3. **Local HTTP**: `secure: false` in dev (correct), but cookie may not be sent if browser enforces SameSite

**Environments**:
- **Local HTTP** (`localhost:3000`): `secure: false` → cookie works
- **Netlify Preview HTTPS** (`*.netlify.app`): `secure: true` (if `NODE_ENV=production`) → cookie works
- **Production Domain HTTPS**: `secure: true` → cookie works

**Redirect Loop Condition**:
- If middleware redirects to `/admin/login`, but login page also checks auth and redirects → loop
- **Current code**: Login page (`src/app/admin/login/page.tsx`) does NOT check auth → no loop
- **Potential issue**: If cookie is set but invalid (expired/secret mismatch), middleware redirects → user sees login → submits → new cookie → should work

---

### PHASE 3: Data Layer Trace (Supabase Fallback)

#### Supabase Integration Flow

**Step 1: Client Component Load** (`src/components/Listings.tsx:20-28`)
- `useEffect` calls `getProperties()` from `src/lib/properties.ts`

**Step 2: Fetch Helper** (`src/lib/properties.ts:4-29`)
- Fetches `/api/properties` with `cache: "no-store"`
- If response not OK → returns `[]` (no mock fallback!)
- If error → returns `[]`

**Step 3: API Route** (`src/app/api/properties/route.ts:5-46`)
- Checks if `supabase` client exists (from `src/lib/supabase.ts:17`)
  - Client is `null` if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` missing
- If `null` → returns `[]` (line 10)
- If exists → queries `properties` table, filters `status = "sale"`, orders by `created_at DESC`
- Transforms DB format (`address_hint` → `addressHint`, etc.)
- Returns JSON array

**Step 4: Component Render** (`src/components/Listings.tsx:64-72`)
- Shows loading spinner if `isLoading`
- Shows "Объекты не найдены" if `properties.length === 0`
- Renders grid if data exists

#### Build-Time vs Runtime

**Mock Data** (`src/data/mock.ts`):
- **Import time**: Build time (TypeScript import)
- **Usage**: Only imported by components that directly reference it (e.g., type definitions, utility functions)
- **NOT used as fallback** in `Listings.tsx` — component always calls API

**Supabase Data**:
- **Fetch time**: Runtime (client-side `useEffect` or server-side fetch)
- **Fallback**: None — returns empty array if Supabase not configured

#### Consequences for Deployment

1. **Netlify Rebuild Not Needed for Data Updates**
   - Properties are fetched at runtime → no rebuild required
   - BUT: If Supabase not configured, listings are empty (no mock fallback)

2. **Empty Listings Issue**
   - **Root cause**: `src/lib/properties.ts:12-13` returns `[]` on API error, no fallback to `mock.ts`
   - **Fix needed**: Either add mock fallback OR ensure Supabase is configured

3. **Build-Time Data (if used)**
   - If any component directly imports `properties` from `mock.ts`, that data is baked into bundle
   - Current: `Listings.tsx` does NOT import mock data → all data is runtime

---

### PHASE 4: Contact Form API Route Trace

#### Client Submit → Telegram Request

**Step 1: Client Submit** (assumed: form in `src/components/Contacts.tsx`)
- POST `/api/contact` with `{ name, phone, comment }`

**Step 2: Route Handler** (`src/app/api/contact/route.ts:3-107`)
- Validates `name` and `phone` present (400 if missing)
- Reads `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from env
- If missing → returns 500 "Сервис временно недоступен"
- Parses `TELEGRAM_CHAT_ID` (supports comma, space, newline separators)
- Formats message with Markdown (escapes special chars)
- Sends to Telegram API for each chat ID (parallel `Promise.all`)
- Returns 200 if at least one succeeds, 500 if all fail

#### Request Validation & Error Handling

**Validation**:
- ✅ Checks `name` and `phone` present
- ❌ No phone format validation
- ❌ No input sanitization (XSS risk in Markdown, but escaped)
- ❌ No length limits

**Error Handling**:
- ✅ Handles missing env vars
- ✅ Handles invalid chat IDs (empty array)
- ✅ Handles partial failures (returns success if ≥1 succeeds)
- ❌ No timeout handling (Telegram API may hang)
- ❌ No retry logic
- ❌ Generic error messages (doesn't leak secrets)

#### Netlify Function Limitations

**Timeouts**:
- Netlify Functions: 10s (Hobby), 26s (Pro), 60s (Business)
- **Risk**: Telegram API slow response → function timeout → 500 error
- **Current code**: No timeout set on `fetch()` → uses default (no timeout in Node.js)

**Networking**:
- ✅ Outbound HTTPS allowed (Telegram API)
- ❌ No explicit timeout/abort controller

**Logging**:
- ✅ Console logs in development (line 95-96)
- ❌ No structured logging for production
- ❌ Errors logged but may not appear in Netlify dashboard

---

## Likely Failure Points (Ranked)

### 1. Cookie Security Flag Inconsistency (HIGH)
- **Location**: `src/app/api/auth/login/route.ts:44`
- **Issue**: Checks `RAILWAY_ENVIRONMENT` (wrong platform)
- **Impact**: May work on Netlify if `NODE_ENV=production`, but code is misleading
- **Verification**: Check Netlify function logs for cookie setting; test login on preview deploy
- **Fix**: Remove Railway check, use `NODE_ENV === "production"` only

### 2. Empty Listings When Supabase Not Configured (HIGH)
- **Location**: `src/lib/properties.ts:12-13`, `src/app/api/properties/route.ts:10`
- **Issue**: Returns `[]` instead of falling back to `mock.ts`
- **Impact**: Site shows "Объекты не найдены" if Supabase vars missing
- **Verification**: Remove Supabase env vars → check listings section
- **Fix**: Add mock fallback in API route OR ensure Supabase is always configured

### 3. Contact Form Timeout Risk (MEDIUM)
- **Location**: `src/app/api/contact/route.ts:54-67`
- **Issue**: No timeout on Telegram API fetch
- **Impact**: Function may timeout on Netlify (10s/26s/60s limits)
- **Verification**: Simulate slow Telegram API → check Netlify function timeout
- **Fix**: Add `AbortController` with timeout (e.g., 8s for Hobby plan)

### 4. JWT Secret Fallback (MEDIUM)
- **Location**: `src/middleware.ts:5`, `src/lib/auth.ts:5`
- **Issue**: Falls back to `"default-secret-change-in-production"` if env var missing
- **Impact**: Security risk if deployed without `JWT_SECRET`
- **Verification**: Check Netlify env vars; test with missing secret
- **Fix**: Throw error in production if `JWT_SECRET` missing

### 5. Inconsistent Cookie Secure Flag (LOW)
- **Location**: `src/app/api/auth/login/route.ts:44` vs `src/app/api/auth/logout/route.ts:9`
- **Issue**: Different logic for `secure` flag
- **Impact**: Minor inconsistency, but both should work on HTTPS
- **Verification**: Test logout on Netlify → verify cookie deleted
- **Fix**: Unify logic (use `NODE_ENV === "production"` in both)

### 6. No Input Sanitization in Contact Form (LOW)
- **Location**: `src/app/api/contact/route.ts:5`
- **Issue**: No validation beyond presence check
- **Impact**: Potential XSS in Telegram message (but Markdown escaped)
- **Verification**: Submit form with script tags → check Telegram message
- **Fix**: Add input sanitization/validation

---

## Minimal Patches

### Patch 1: Fix Cookie Secure Flag (Login Route)
**File**: `src/app/api/auth/login/route.ts`
**Line**: 44
**Change**: Remove Railway check, use `NODE_ENV` only

```typescript
// BEFORE (line 44):
const isProduction = process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT === "production";

// AFTER:
const isProduction = process.env.NODE_ENV === "production";
```

### Patch 2: Add Mock Fallback for Properties
**File**: `src/app/api/properties/route.ts`
**Lines**: 5-11
**Change**: Import and return mock data if Supabase not configured

```typescript
// Add import at top:
import { properties as mockProperties } from "@/data/mock";

// Replace lines 5-11:
export async function GET() {
  try {
    if (!supabase) {
      // Return mock data as fallback
      const properties = mockProperties.map((prop) => ({
        id: prop.id,
        title: prop.title,
        district: prop.district,
        addressHint: prop.addressHint,
        priceRub: prop.priceRub,
        areaM2: prop.areaM2,
        rooms: prop.rooms,
        status: prop.status,
        imageUrl: prop.imageUrl,
        description: prop.description,
        features: prop.features || [],
      }));
      return NextResponse.json(properties);
    }
    // ... rest of existing code
```

### Patch 3: Add Timeout to Telegram API Call
**File**: `src/app/api/contact/route.ts`
**Lines**: 52-80
**Change**: Add `AbortController` with 8s timeout

```typescript
// Replace the sendPromises map (lines 52-80):
const sendPromises = chatIds.map(async (chatId) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
  
  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
        signal: controller.signal, // Add abort signal
      }
    );

    clearTimeout(timeoutId);

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error(`Telegram API error for chat ${chatId}:`, errorData);
      return { success: false, chatId, error: errorData };
    }

    return { success: true, chatId };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`Telegram API timeout for chat ${chatId}`);
      return { success: false, chatId, error: "Request timeout" };
    }
    console.error(`Error sending to chat ${chatId}:`, error);
    return { success: false, chatId, error: error instanceof Error ? error.message : "Unknown error" };
  }
});
```

### Patch 4: Enforce JWT Secret in Production
**File**: `src/middleware.ts`
**Lines**: 4-6
**Change**: Throw error if secret missing in production

```typescript
// BEFORE:
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production"
);

// AFTER:
const JWT_SECRET_ENV = process.env.JWT_SECRET;
if (!JWT_SECRET_ENV && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is required in production");
}
const JWT_SECRET = new TextEncoder().encode(
  JWT_SECRET_ENV || "default-secret-change-in-production"
);
```

**Also update**: `src/lib/auth.ts:4-6` with same logic.

### Patch 5: Unify Cookie Secure Flag Logic
**File**: `src/app/api/auth/logout/route.ts`
**Line**: 9
**Change**: Match login route logic (already correct, but document consistency)

```typescript
// Current (correct):
secure: process.env.NODE_ENV === "production",

// No change needed, but ensure login route matches (see Patch 1)
```

---

## Verification Steps

1. **Test Login Flow on Netlify Preview**:
   - Deploy to Netlify preview
   - Visit `/admin/login`
   - Submit credentials
   - Check browser DevTools → Application → Cookies → verify `auth_token` has `Secure` flag (if HTTPS)
   - Visit `/admin` → should load dashboard

2. **Test Empty Listings**:
   - Remove `NEXT_PUBLIC_SUPABASE_URL` from Netlify env vars
   - Redeploy
   - Visit homepage → check listings section → should show mock data (after Patch 2) or empty (before)

3. **Test Contact Form Timeout**:
   - Simulate slow Telegram API (or use invalid token)
   - Submit form
   - Check Netlify function logs → should see timeout error (after Patch 3) or hang (before)

4. **Test JWT Secret Missing**:
   - Remove `JWT_SECRET` from Netlify env vars
   - Redeploy
   - Check build logs → should fail (after Patch 4) or use default (before)

---

**End of Analysis**

