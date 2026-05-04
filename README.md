# Nutado Dashboard

> **Every Home Deserves Better Snacking** — Premium snack gifting & subscription platform.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript (strict)                 |
| Styling     | Tailwind CSS 3.4                    |
| Icons       | Lucide React                        |
| Fonts       | Inter (body) + Poppins (headings)   |
| State       | React Context (OnboardingContext)   |
| API         | Next.js Route Handlers (stubs)      |

---

## Quick Start

```bash
cp .env.example .env.local   # fill in your values
npm install
npm run dev                  # http://localhost:3000
```

`/` auto-redirects to `/login`.

**Keyboard shortcut:** `Cmd+K` / `Ctrl+K` opens the global search palette from anywhere in the dashboard.

---

## Complete File Structure (73 files)

```
src/
├── app/
│   ├── layout.tsx, page.tsx, not-found.tsx, error.tsx
│   ├── login/page.tsx              Split-panel login
│   ├── signup/page.tsx             Multi-field registration
│   ├── onboarding/
│   │   ├── layout.tsx + loading.tsx
│   │   └── step1 → step8          Full 8-step gifting wizard
│   ├── dashboard/
│   │   ├── layout.tsx              Sidebar + Topbar + CommandPalette (Cmd+K)
│   │   ├── loading.tsx             Full skeleton
│   │   ├── page.tsx                KPIs, bar chart, upcoming orders, recent table
│   │   ├── orders/
│   │   │   ├── page.tsx            Table + search + status filter + CSV export
│   │   │   └── [id]/page.tsx       Detail: timeline, line items, delivery, customer
│   │   ├── products/
│   │   │   ├── page.tsx            Grid/list + category filter + Add Product modal
│   │   │   └── [id]/page.tsx       Detail: pricing, stats, chart, packaging, delete
│   │   ├── customers/
│   │   │   ├── page.tsx            Cards + search + Add Customer modal
│   │   │   └── [id]/page.tsx       Profile: contact, order history, notes, tags
│   │   ├── analytics/page.tsx      KPIs, monthly chart, occasion breakdown, top products
│   │   └── settings/page.tsx       Tabs: Profile, Company, Branding, Appearance, Notifications, Security
│   └── api/
│       ├── orders/route.ts         GET (filter+paginate), POST
│       ├── orders/[id]/route.ts    GET, PATCH, DELETE
│       ├── products/route.ts       GET, POST
│       ├── customers/route.ts      GET, POST
│       └── analytics/route.ts      GET summary stats
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             Collapsible nav, mobile overlay, user profile
│   │   ├── Topbar.tsx              Search trigger (Cmd+K), notifications, avatar
│   │   └── CommandPalette.tsx      Full-text search: orders, products, customers, pages
│   ├── dashboard/
│   │   ├── RevenueChart.tsx        12-month CSS bar chart
│   │   ├── RecentOrders.tsx        Mini orders table
│   │   ├── AddProductModal.tsx     Validated form: emoji, name, brand, price, weight
│   │   └── AddCustomerModal.tsx    Validated form: name, company, email, phone
│   ├── onboarding/
│   │   └── OnboardingStepper.tsx   8-step progress indicator
│   └── ui/                        Design system (barrel: components/ui/index.ts)
│       ├── Button.tsx              primary/secondary/ghost/danger + loading spinner
│       ├── Input.tsx               label, hint, error, left/right icon slots
│       ├── Select.tsx              Styled native dropdown
│       ├── Modal.tsx               Escape-dismissible, scroll-locked
│       ├── ConfirmDialog.tsx       Reusable danger/primary confirmation
│       ├── Breadcrumb.tsx          Chevron-separated trail
│       ├── Badge.tsx               7 colour variants with optional dot
│       ├── StatusBadge.tsx         Order status pill
│       ├── StatCard.tsx            KPI card with trend badge
│       ├── EmptyState.tsx          Empty state with emoji/icon + CTA slot
│       ├── Skeleton.tsx            Pulse loading skeletons
│       ├── Spinner.tsx             Inline + full-screen LoadingScreen
│       ├── Toast.tsx               Slide-in toasts (success/error/info/warning)
│       └── ThemeToggle.tsx         Light / Dark / System switcher
│
├── context/
│   └── OnboardingContext.tsx       Shared state across all 8 onboarding steps
│
├── hooks/
│   ├── useToast.ts                 Toast queue management
│   ├── useDebounce.ts              Value debounce (default 300ms)
│   ├── useLocalStorage.ts          SSR-safe localStorage hook
│   ├── usePageTitle.ts             Dynamic breadcrumb title from pathname
│   └── useTheme.ts                 Light/dark/system theme with persistence
│
├── lib/
│   ├── mockData.ts                 8 orders, 6 customers, 8 products, 12-mo revenue
│   ├── utils.ts                    formatCurrency, formatDate, getStatusColor, clsx
│   ├── cn.ts                       className merge helper
│   ├── export.ts                   CSV export utility (wired to orders page)
│   └── constants.ts                App-wide constants: occasions, bundle sizes, brand
│
├── styles/
│   └── globals.css                 Tailwind + .btn-primary, .btn-secondary, .input-field, .card
│
└── types/
    └── index.ts                    User, Product, Order, Customer, Analytics, Onboarding
```

---

## User Flow

```
/login → /signup
         ↓
/onboarding/step1 (occasions) → step2 (categories) → step3 (browse + cart)
→ step4 (bundle + qty) → step5 (products) → step6 (branding)
→ step7 (review, live from context) → step8 (confirmed, context reset)
         ↓
/dashboard
  ├── /orders        → /orders/[id]
  ├── /products      → /products/[id]
  ├── /customers     → /customers/[id]
  ├── /analytics
  └── /settings
```

---

## Key Features

| Feature | Detail |
|---|---|
| **⌘K Search** | Full-text search across orders, products, customers, and pages |
| **8-Step Onboarding** | Shared React Context, live order review, auto-reset on completion |
| **CSV Export** | One-click export of filtered orders list |
| **Dark Mode** | Light / Dark / System toggle, persisted to localStorage |
| **Add Product** | Modal form with emoji picker, validation, all fields |
| **Add Customer** | Modal with email validation |
| **Order Detail** | Full timeline, line items, delivery tracking, customer info |
| **Product Detail** | Stats, monthly chart, packaging options, delete with confirm |
| **Customer Profile** | Order history, notes, tags, contact details |
| **Loading Skeletons** | Every route has a `loading.tsx` with matching skeleton |
| **API Stubs** | 5 Route Handlers ready to connect to a real database |

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `nutado-green` | `#0a6e3a` | Primary brand |
| `nutado-green-dark` | `#064d28` | Hover states |
| `bg-brand-gradient` | `linear-gradient(135deg,…)` | Auth panels |
| `font-display` | Poppins | Headings |
| `font-sans` | Inter | Body text |

---

## Next Steps

- [ ] Swap `MOCK_*` with real API calls (SWR or React Query)
- [ ] Add NextAuth.js or Clerk for authentication
- [ ] Connect Razorpay for payment checkout
- [ ] Replace CSS bar chart with Recharts for interactivity
- [ ] Add product CRUD (edit form, image upload via Cloudinary)
- [ ] Implement role-based access (admin / manager / viewer)
- [ ] Real-time order updates via WebSockets
- [ ] Write Jest + React Testing Library tests
- [ ] Set up GitHub Actions + Vercel deployment
- [ ] Add i18n (Hindi, Tamil)

---

*Figma: https://www.figma.com/design/0BX51C4f6I6JRNpZhW4mJC/Nutado-Dashboard*
