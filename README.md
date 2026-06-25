# StartupForge — Client

The frontend for **StartupForge**, a platform where startup founders build teams and collaborators find opportunities to join.

**Live Site:** https://startupforge-client-nine.vercel.app
**Server Repo:** https://github.com/actuallyayon/startupforge-server

## Tech Stack
- **Next.js 15 (App Router & Server/Client Components)**
- **Next.js Middleware** (JWT and role-based route protection)
- **TanStack Query** (data fetching & caching)
- **Tailwind CSS** (responsive design, dark/light theme, Next/font integration)
- **Framer Motion** (animations)
- **Better Auth** (Next.js integration — email/password + Google)
- **Recharts** (dashboard charts)
- **react-hook-form**, **react-hot-toast**, **axios**

## Features
- Auth: register (with role + imgbb image), login, Google sign-in
- Home with banner, featured startups/opportunities, success stories, and animations
- Browse Opportunities with **server-side search, filters, and pagination**
- **Founder dashboard:** create/manage startup, post/manage opportunities, review applications, premium upgrade
- **Collaborator dashboard:** apply, track application status, manage profile
- **Admin dashboard:** manage users (block/unblock), approve/remove startups, view transactions & revenue
- Stripe Checkout for the founder premium package
- Dark / light theme toggle
- Fully responsive (mobile / tablet / desktop)

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev                  # http://localhost:3000
```

## Environment Variables
See [.env.example](.env.example):
- `NEXT_PUBLIC_API_URL` — base URL of the StartupForge server (e.g. `http://localhost:5000`)
- `NEXT_PUBLIC_IMGBB_KEY` — imgbb API key for image uploads
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` — Stripe publishable key

## Build & Deploy
```bash
npm run build   # builds the Next.js production bundle
npm run start   # starts the production server
```

## Project Structure
```text
app/
  (public)/          # Marketing pages (/, /startups, /opportunities, /login, /register)
  dashboard/         # Role-based dashboard layouts
    admin/           # Admin protected routes
    collaborator/    # Collaborator protected routes
    founder/         # Founder protected routes
  layout.jsx         # Root layout with fonts, providers, and metadata
  payment-success/   # Stripe redirect success page
src/
  components/        # Reusable UI (Navbar, Footer, cards, charts)
  context/           # AuthContext, ThemeContext
  lib/               # authClient, axios api
```
