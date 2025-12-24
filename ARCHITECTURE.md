# Pach Group — Architecture Documentation

## 1. Executive Summary

**Pach Group** is a real estate agency website for Nalchik, Russia, built as a modern single-page application (SPA) showcasing property listings, services, testimonials, and contact forms. The site targets potential property buyers and sellers in the Nalchik region, offering a catalog of available properties (apartments, houses, townhouses) with detailed information, a contact form that sends notifications via Telegram, and a basic admin panel for property management. The main features include: an interactive property catalog with modal detail views, a 3D house visualization using Three.js, animated UI components powered by Framer Motion, a contact form with Telegram integration, and a JWT-protected admin panel for adding new listings. The application is currently deployed on **Netlify** using the `@netlify/plugin-nextjs` plugin, which handles Next.js server-side rendering and API routes automatically. For VPS/server deployment, the project would need: Node.js 18+ runtime, a process manager (PM2/systemd), Nginx as a reverse proxy, environment variables configured, and the build output (`.next` directory) served via `next start` on a production port.

---

## 2. Tech Stack and Runtime Model

**Framework/Library:**
- **Next.js 14.2.15** (App Router) — React framework with server-side rendering
- **React 18.3.1** — UI library
- **TypeScript 5.6.3** — Type safety

**Build System:**
- **Next.js built-in bundler** (Webpack/Turbopack)
- Build command: `npm run build` (produces `.next` directory)
- Development: `npm run dev` (runs on `localhost:3000`)
- Production: `npm start` (runs Next.js production server)

**Runtime Model:**
- **Hybrid rendering**: Static pages (home page) + Server-side API routes
- **API Routes**: Next.js API routes in `src/app/api/` handle:
  - Authentication (`/api/auth/login`, `/api/auth/check`, `/api/auth/logout`)
  - Contact form submission (`/api/contact`)
- **Client Components**: Most UI components are marked `"use client"` for interactivity
- **Server Components**: Root layout (`src/app/layout.tsx`) is server-rendered for SEO

**Environment Variables:**
- **Required**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- **Optional**: `DATABASE_URL` (for future DB integration), `NEXT_PUBLIC_SITE_URL`
- Location: `.env.local` (development), Netlify Environment Variables (production)
- Template: `env.template` (documented with instructions)

---

## 3. Repository Map

### Key Directories and Files

```
Sait/
├── src/
│   ├── app/                          # Next.js App Router directory
│   │   ├── layout.tsx                # Root layout (SEO metadata, fonts, global structure)
│   │   ├── page.tsx                  # Home page entry point (composes all sections)
│   │   ├── globals.css               # Global Tailwind styles, utility classes
│   │   ├── admin/                    # Admin panel routes
│   │   │   ├── page.tsx              # Admin dashboard (property form)
│   │   │   └── login/page.tsx        # Login page
│   │   └── api/                      # API route handlers
│   │       ├── auth/
│   │       │   ├── login/route.ts    # POST /api/auth/login (JWT creation)
│   │       │   ├── check/route.ts    # GET /api/auth/check (verify token)
│   │       │   └── logout/route.ts   # POST /api/auth/logout (clear cookie)
│   │       └── contact/route.ts      # POST /api/contact (Telegram notification)
│   ├── components/                    # React components
│   │   ├── Header.tsx                 # Navigation header (sticky, mobile menu)
│   │   ├── Hero.tsx                  # Hero section with CTA buttons
│   │   ├── HouseAnimation.tsx         # 3D house visualization wrapper
│   │   ├── House3D.tsx               # Three.js 3D scene component
│   │   ├── Listings.tsx               # Property catalog grid
│   │   ├── PropertyModal.tsx          # Modal for property details
│   │   ├── Deals.tsx                 # Completed deals showcase
│   │   ├── Services.tsx               # Services section
│   │   ├── Testimonials.tsx           # Customer reviews
│   │   ├── Contacts.tsx               # Contact form component
│   │   └── Footer.tsx                 # Site footer
│   ├── data/
│   │   └── mock.ts                    # Hardcoded data (properties, deals, testimonials)
│   ├── lib/
│   │   └── auth.ts                    # JWT utilities (createToken, verifyToken, validateCredentials)
│   └── middleware.ts                  # Next.js middleware (protects /admin routes)
├── public/                            # Static assets (if any)
├── netlify.toml                       # Netlify deployment config
├── next.config.mjs                    # Next.js config (image domains)
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript config (path aliases: @/*)
├── package.json                       # Dependencies and scripts
└── env.template                       # Environment variables template
```

### Entry Points

**Main Application Entry:**
- `src/app/layout.tsx` — Root layout (wraps all pages, sets fonts, metadata)
- `src/app/page.tsx` — Home page (renders: Header → Hero → HouseAnimation → Listings → Deals → Services → Testimonials → Contacts → Footer)

**Routing:**
- Next.js App Router uses file-based routing:
  - `/` → `src/app/page.tsx`
  - `/admin` → `src/app/admin/page.tsx` (protected by middleware)
  - `/admin/login` → `src/app/admin/login/page.tsx` (public)
  - API routes: `/api/*` → `src/app/api/*/route.ts`

**Page Composition:**
- Home page (`src/app/page.tsx`) imports and renders components in order:
  1. `Header` (fixed navigation)
  2. `Hero` (hero section)
  3. `HouseAnimation` (3D visualization)
  4. `Listings` (property grid)
  5. `Deals` (completed deals)
  6. `Services` (services list)
  7. `Testimonials` (reviews)
  8. `Contacts` (contact form)
  9. `Footer` (footer)

All components are client-side (`"use client"`) except the root layout.

---

## 4. Data Model

**Listings/Objects Source:**
- **Hardcoded TypeScript file**: `src/data/mock.ts`
- Exports arrays: `properties`, `deals`, `testimonials`
- Type definitions: `Property`, `Deal`, `Testimonial` interfaces
- **No database** — data is statically imported at build time
- Admin panel (`src/app/admin/page.tsx`) generates formatted code snippets that must be manually pasted into `mock.ts` (no automatic persistence)

**Property Data Structure:**
```typescript
interface Property {
  id: string;
  title: string;
  district: string;
  addressHint: string;
  priceRub: number;
  areaM2: number;
  rooms: number;
  status: "sale";
  imageUrl: string;  // External URLs (Unsplash)
  description: string;
  features: string[];
}
```

**Reviews/Testimonials:**
- Stored in `src/data/mock.ts` as `testimonials` array
- Structure: `{ id, initials, text }`
- No backend storage — static data

**Images/Assets:**
- **No local image storage** — all images use external URLs
- Primary source: `images.unsplash.com` (configured in `next.config.mjs` remotePatterns)
- Images loaded via Next.js `Image` component for optimization
- Admin panel supports file upload (converts to base64 data URL) or URL input

**Backend:**
- **No traditional backend** — Next.js API routes act as serverless functions
- API routes handle:
  - Authentication (JWT in HTTP-only cookies)
  - Contact form → Telegram Bot API
- No database, file storage, or external APIs beyond Telegram

---

## 5. UI Architecture

**Component Structure:**
- **Naming**: PascalCase (`Header.tsx`, `PropertyModal.tsx`)
- **Location**: All in `src/components/` (flat structure, no subdirectories)
- **Pattern**: Functional components with TypeScript interfaces for props
- **Client Components**: All components use `"use client"` directive (required for Framer Motion, state, event handlers)

**Styling Approach:**
- **Tailwind CSS 3.4** — utility-first CSS framework
- **Configuration**: `tailwind.config.ts` defines:
  - Custom colors: `accent` (#722F37), `neutral` palette
  - Custom fonts: `display` (Cormorant Garamond), `sans` (Inter)
  - Custom animations: `fade-in`, `slide-up`, `scale-in`
- **Global Styles**: `src/app/globals.css` contains:
  - Tailwind directives (`@tailwind base/components/utilities`)
  - Utility classes: `.btn-primary`, `.btn-secondary`, `.section-padding`, `.container-width`, `.heading-display`
  - Custom animations (gradient shift, float)
  - Scrollbar styling

**Responsiveness:**
- **Mobile-first**: Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px)
- **Grid layouts**: Responsive grids (`grid sm:grid-cols-2 lg:grid-cols-3`)
- **Navigation**: Mobile hamburger menu (hidden on `lg:`), desktop horizontal nav
- **Typography**: Fluid sizing (`text-4xl sm:text-5xl md:text-6xl lg:text-7xl`)

**Animation Libraries:**
- **Framer Motion 11.11.9** — primary animation library
- **Usage locations**:
  - `Hero.tsx`: Staggered text animations, button hover effects
  - `Header.tsx`: Mobile menu slide-in (`AnimatePresence`)
  - `Listings.tsx`: Card hover effects, modal transitions
  - `Deals.tsx`: Staggered grid animations
  - `PropertyModal.tsx`: Modal entrance/exit animations
- **Three.js 0.169.0** + **@react-three/fiber** + **@react-three/drei**: 3D house visualization in `House3D.tsx` / `HouseAnimation.tsx`
- **CSS animations**: Custom keyframes in `globals.css` (gradient shift, float)

---

## 6. Deployment

### Current Deployment (Netlify)

**Configuration File:** `netlify.toml`
```toml
[build]
  command = "npm run build"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Deployment Pipeline:**
- **Trigger**: Git push to connected branch (usually `main`)
- **Build command**: `npm run build` (runs Next.js build)
- **Publish directory**: `.next` (handled automatically by `@netlify/plugin-nextjs`)
- **Environment variables**: Set in Netlify Dashboard → Site Settings → Environment Variables
- **Plugin**: `@netlify/plugin-nextjs` handles Next.js SSR, API routes, and static optimization

**Local Production Build:**
```bash
npm run build        # Creates .next directory
npm start            # Runs production server on localhost:3000
```

**Production Artifact:**
- `.next/` directory contains:
  - Compiled pages (`.next/server/`)
  - Static assets (`.next/static/`)
  - API route handlers
- No separate "dist" folder — Next.js serves from `.next/`

### VPS Deployment (Ubuntu + Nginx)

**Prerequisites:**
- Node.js 18+ installed
- PM2 or systemd for process management
- Nginx installed and configured

**Steps:**

1. **Build the application:**
   ```bash
   npm install
   npm run build
   ```

2. **Set up environment variables:**
   Create `.env.local` or use systemd environment file with:
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`

3. **Run with PM2:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "pach-group" -- start
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration** (`/etc/nginx/sites-available/pach-group`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Enable site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/pach-group /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **SSL (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

**Files to Serve:**
- Next.js handles routing internally — serve everything through the Node.js server on port 3000
- Nginx acts as reverse proxy only (no static file serving needed)
- Static assets are served by Next.js from `.next/static/`

---

## 7. Risks and Improvements (Prioritized)

### Security

**High Priority:**
1. **Admin credentials in environment variables** (plain text password)
   - **Risk**: If `.env.local` is exposed, admin account is compromised
   - **Fix**: Hash passwords with bcrypt, store hash in env, compare in `src/lib/auth.ts`
   - **Location**: `src/lib/auth.ts:40` (`validateCredentials` function)

2. **JWT secret default value**
   - **Risk**: `"default-secret-change-in-production"` is hardcoded fallback
   - **Fix**: Make `JWT_SECRET` required (throw error if missing in production)
   - **Location**: `src/middleware.ts:4-6`, `src/lib/auth.ts:4-6`

3. **No rate limiting on API routes**
   - **Risk**: Contact form and login endpoints vulnerable to brute force
   - **Fix**: Add rate limiting (e.g., `@upstash/ratelimit` or middleware)
   - **Location**: `src/app/api/contact/route.ts`, `src/app/api/auth/login/route.ts`

4. **No input sanitization**
   - **Risk**: XSS via contact form fields
   - **Fix**: Sanitize user input before sending to Telegram
   - **Location**: `src/app/api/contact/route.ts:5` (name, phone, comment)

**Medium Priority:**
5. **HTTP-only cookies not enforced in development**
   - **Current**: `secure` flag only in production (`process.env.NODE_ENV === "production"`)
   - **Risk**: Token theft in development if using HTTP
   - **Location**: `src/app/api/auth/login/route.ts:29`

### Performance

**High Priority:**
1. **External image dependencies (Unsplash)**
   - **Risk**: Slow loading, potential broken images if URLs change
   - **Fix**: Download and host images locally or use CDN
   - **Location**: `src/data/mock.ts` (all `imageUrl` fields)

2. **No image optimization for uploaded images**
   - **Risk**: Large base64 images in admin panel slow down page
   - **Fix**: Compress/resize before converting to base64 or upload to storage
   - **Location**: `src/app/admin/page.tsx:296-304`

**Medium Priority:**
3. **Bundle size** (Three.js, Framer Motion are large)
   - **Current**: All libraries loaded on initial page load
   - **Fix**: Code-split 3D components (lazy load `HouseAnimation`)
   - **Location**: `src/app/page.tsx:3` (import `HouseAnimation`)

4. **No caching headers for static assets**
   - **Fix**: Configure Next.js caching or add Nginx cache headers

### Maintainability

**High Priority:**
1. **Data persistence in code file**
   - **Current**: Admin panel copies code to clipboard, manual paste into `mock.ts`
   - **Risk**: Error-prone, no version history, conflicts in team
   - **Fix**: Integrate database (PostgreSQL/Supabase) or file-based storage (JSON file with API)

2. **No TypeScript strict mode for some areas**
   - **Fix**: Enable stricter TypeScript checks, add missing type annotations
   - **Location**: Check `tsconfig.json` (currently `strict: true` but verify)

**Medium Priority:**
3. **Component organization** (flat structure)
   - **Current**: All components in one directory
   - **Fix**: Organize by feature (`components/layout/`, `components/properties/`, etc.)

4. **Duplicate utility functions**
   - **Location**: `src/data/mock.ts:167-180` (formatPrice, formatArea, getRoomsLabel)
   - **Fix**: Move to `src/lib/utils.ts` for reuse

### SEO Basics

**Current State:**
- ✅ Meta tags in `src/app/layout.tsx` (title, description, keywords, Open Graph, Twitter)
- ✅ Semantic HTML structure
- ❌ No structured data (JSON-LD)
- ❌ No sitemap.xml
- ❌ No robots.txt

**Improvements:**
1. Add JSON-LD schema for real estate listings
2. Generate sitemap (`next-sitemap` package)
3. Add `robots.txt` in `public/`
4. Add canonical URLs

### Next Steps for Real Estate Platform

**Phase 1: Data Layer**
1. **Database integration** (PostgreSQL/Supabase)
   - Migrate `mock.ts` to database tables
   - Create API routes: `GET /api/properties`, `POST /api/properties`, `PUT /api/properties/:id`, `DELETE /api/properties/:id`
   - Update admin panel to use API instead of clipboard

2. **Image storage** (Cloudinary/AWS S3/Next.js Image Optimization API)
   - Upload endpoint for admin panel
   - Replace base64 with CDN URLs

**Phase 2: Admin Panel**
3. **Full CRUD operations**
   - Edit existing properties
   - Delete properties
   - Bulk operations
   - Property status management (sale, sold, pending)

4. **User management**
   - Multiple admin users
   - Role-based access control

**Phase 3: CMS Features**
5. **Content management**
   - Edit testimonials, deals, services via admin
   - Rich text editor for descriptions
   - SEO fields per property

**Phase 4: Public Features**
6. **Search and filters**
   - Filter by price, area, rooms, district
   - Search by keyword
   - Sort options

7. **Property detail pages**
   - Dynamic routes: `/property/[id]`
   - Image galleries
   - Virtual tours integration

8. **Lead management**
   - Store form submissions in database
   - Admin dashboard for leads
   - Email notifications in addition to Telegram

**Phase 5: Advanced**
9. **Analytics integration**
   - Google Analytics / Yandex Metrika
   - Property view tracking
   - Conversion tracking

10. **Multi-language support**
    - i18n (next-intl)
    - Russian/English toggle

---

## Summary

**Current State:** MVP with static data, basic admin panel, Telegram integration, modern UI with animations.

**Key Strengths:** Clean code structure, TypeScript safety, modern stack, good SEO foundation, responsive design.

**Critical Gaps:** No database, manual data management, security hardening needed, external image dependencies.

**Recommended Path:** Start with database integration and image storage, then expand admin capabilities, followed by public-facing features (search, filters, detail pages).

