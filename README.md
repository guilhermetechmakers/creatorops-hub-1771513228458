# CreatorOps Hub

An integrated workspace that centralizes assets, planning, research, and AI-assisted execution for creators, small creator teams, and personal brand managers.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router 6** for routing
- **Tailwind CSS v3** with @tailwindcss/typography
- **TanStack React Query** for data fetching
- **React Hook Form** + **Zod** for forms
- **Recharts** for data visualization
- **Sonner** for toasts
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppSidebar, DashboardLayout, PublicLayout
│   └── ui/           # Button, Card, Input, Skeleton, Label
├── lib/
│   ├── api.ts        # API utilities (fetch wrapper)
│   └── utils.ts      # cn() class merger
├── pages/            # Route pages
│   ├── landing.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── dashboard.tsx
│   ├── projects.tsx
│   ├── file-library.tsx
│   ├── content-studio.tsx
│   ├── research.tsx
│   ├── planner.tsx
│   ├── inbox.tsx
│   ├── analytics.tsx
│   ├── integrations.tsx
│   ├── settings.tsx
│   ├── profile.tsx
│   ├── admin.tsx
│   ├── checkout.tsx
│   ├── not-found.tsx
│   └── server-error.tsx
└── App.tsx           # Router + providers
```

## Routes

- **Public:** `/`, `/login`, `/signup`, `/password-reset`, `/email-verification`, `/about`, `/help`, `/privacy`, `/terms`
- **Dashboard:** `/dashboard`, `/dashboard/projects`, `/dashboard/library`, `/dashboard/studio`, `/dashboard/research`, `/dashboard/planner`, `/dashboard/inbox`, `/dashboard/analytics`, `/dashboard/integrations`, `/dashboard/settings`, `/dashboard/profile`, `/dashboard/admin`
- **Checkout:** `/checkout`
- **Errors:** `/404`, `/500`

## Design System

- **Primary background:** #232324
- **Card:** #18181A
- **Accent:** #FF3B30
- **Border:** #313134

See `design_rules.md` for full design guidelines.
