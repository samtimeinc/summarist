# 📚 Summarist

> Gain more knowledge in less time. Summarist is a full-stack audiobook and book-summary app that lets busy people discover, read, and listen to the core ideas of the best non-fiction titles.

Built with **Next.js 16 (App Router)**, **React 18**, **TypeScript**, **Firebase**, **Stripe**, and **Redux Toolkit**.

---

## ✨ Overview

Summarist helps readers and listeners get the key takeaways from popular books in minutes. Authenticated users can browse curated recommendations, save titles to a personal library, listen to audio summaries with a full-featured player, and unlock premium content through Stripe-managed subscriptions.

---

## 🚀 Features

### 🔐 Authentication
- Email & password sign-up / log-in with validation
- Google OAuth one-click sign-in
- Anonymous "guest" browsing
- Password reset flow
- Session persistence via secure, `httpOnly` Firebase ID-token cookies
- Centralized `AuthListener` that syncs auth state to Redux, Firestore listeners, and subscription status

### 📖 Discovery & Reading
- Marketing landing page with rotating statistics, features, reviews, and a CTA
- **For You** feed with three curated shelves: *Selected for you*, *Recommended*, and *Suggested*
- Full book detail pages with tags, key ideas, summaries, author info, and ratings
- Server-rendered (SSR) data fetching for fast initial loads

### 🔍 Search
- Debounced, live search across titles and authors
- Streamlined search-results UI inside the post-login shell

### 🎧 Audio Player
- Custom-built player with play/pause, scrubbing progress bar, and volume control
- 10-second rewind / fast-forward skip buttons
- Real-time progress tracking
- Auto-marks a book as "finished" once playback completes

### 🏪 Personal Library
- Save books for later and track finished titles
- Library synced in real time with Firestore (`onSnapshot` listeners)
- Server-side verified reads using the Firebase Admin SDK

### 💳 Subscriptions (Stripe)
- Three tiers: **Basic** (free/guest), **Premium** (monthly), and **Premium Plus** (yearly)
- Stripe Checkout sessions created through Firestore Cloud Functions
- Live subscription status streaming
- Self-serve plan management via the Stripe Customer Portal
- Trial-period support

### 🎨 User Experience & Accessibility
- Fully responsive layout (desktop, tablet, mobile) with a slide-in side navigation bar
- Adjustable font sizes for accessible reading
- Skeleton loaders and loading animations throughout
- Toast notifications for user feedback
- Custom 404 page

---

## 🛠️ Tech Stack

| Layer            | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router, React Server Components)  |
| Language         | [TypeScript](https://www.typescriptlang.org/)                           |
| UI Library       | [React 18](https://react.dev)                                           |
| State Management | [Redux Toolkit](https://redux-toolkit.js.org/) + `react-redux`          |
| Auth & Database  | [Firebase](https://firebase.google.com/) Auth, Firestore, Functions     |
| Admin SDK        | [firebase-admin](https://firebase.google.com/docs/admin) for SSR/cookies|
| Payments         | [Stripe](https://stripe.com) Subscriptions + Customer Portal            |
| HTTP             | [Axios](https://axios-http.com)                                         |
| Carousel         | [Embla Carousel](https://www.embla-carousel.com/)                       |
| Icons            | [react-icons](https://react-icons.github.io/react-icons/)              |
| Styling          | CSS Modules + global CSS                                                |
| Compiler         | [React Compiler](https://react.dev/learn/react-compiler) (enabled)      |

---

## 📦 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- A **Firebase** project with Authentication, Firestore, and Cloud Functions enabled
- A **Stripe** account with at least one monthly and one yearly subscription price

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd summarist

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Then fill in the values (see below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the development server             |
| `npm run build` | Create an optimized production build     |
| `npm run start` | Run the production build locally         |

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following keys:

```env
# Firebase Admin SDK (server-side, used for token verification & SSR)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe price IDs (exposed to the client intentionally)
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_xxxxxxxxxxxxxxxx
```

> **Note:** The client-facing Firebase web config currently lives in `lib/firebase/firebase.ts`. These values are safe to expose, but for production you may move them into `NEXT_PUBLIC_`-prefixed environment variables.

---

## 📁 Project Structure

```
summarist/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, AuthListener)
│   ├── page.tsx                  # Public landing page
│   ├── providers.tsx             # Redux + Context providers
│   ├── not-found.tsx             # Custom 404
│   └── (post-login)/             # Route group for authenticated UI
│       ├── layout.tsx            # Side nav + search shell
│       ├── for-you/              # Curated book feed (SSR)
│       ├── my-library/           # Saved & finished books (SSR + verified)
│       ├── book/[id]/            # Book detail page
│       ├── player/[id]/          # Audio player page
│       ├── choose-plan/          # Stripe subscription management
│       ├── settings/             # App settings + font size
│       └── log-in/               # Login screen
├── components/                   # Reusable UI components
│   ├── Audio-Player/             # Player controls, details, progress bar
│   ├── home-components/          # Landing-page sections
│   ├── book-page-components/     # Book-page widgets (tags, etc.)
│   └── Toast/                    # Toast notification system
├── context/                      # React Context providers
│   ├── AudioPlayerContext.tsx    # Global audio playback state
│   ├── AuthModalContext.tsx      # Auth modal open/close state
│   └── FontSizeContext.tsx       # Accessible font-size scaling
├── hooks/                        # Custom React hooks
├── lib/
│   ├── actions/                  # Next.js Server Actions (auth cookies)
│   ├── constants/                # Stripe price constants
│   ├── firebase/                 # Client + Admin Firebase initialization
│   └── redux/                    # Redux store + slices
├── services/                     # Firebase/Stripe/Axios service modules
├── types/                        # Shared TypeScript interfaces
├── proxy.ts                      # Route-protection middleware
└── next.config.ts                # Next.js config (React Compiler enabled)
```

---

## 🏗️ Architecture Notes

### Authentication Flow
1. The client authenticates through Firebase (email/password, Google, or anonymous).
2. `AuthListener` listens to `onIdTokenChanged`, retrieves a fresh ID token, and stores it in an `httpOnly` cookie via a Next.js Server Action.
3. `proxy.ts` (middleware) inspects the cookie and redirects unauthenticated users away from protected routes (`/my-library`, `/settings`, `/player`, `/choose-plan`) toward `/log-in`.
4. Server components use the **Firebase Admin SDK** to verify the token and read/write Firestore as the authenticated user.

### Data & Real-Time Updates
- Book catalog data is fetched from Firebase Cloud Functions over HTTPS.
- User libraries (`saved_books`, `finished_books`) and subscriptions are streamed in real time with Firestore `onSnapshot` listeners.
- Redux stores session state, library contents, subscription tier, and toast notifications as the single source of truth on the client.

### Subscriptions
- Stripe Checkout and Customer Portal sessions are created by writing to Firestore, which triggers a Cloud Function that returns a Stripe-hosted URL.
- The `subscriptionSlice` exposes `basic`, `premium`, and `premium-plus` tiers used to gate premium content.

---

## 🔒 Protected Routes

The following routes require an authenticated session and will redirect to `/log-in`:

- `/my-library`
- `/settings`
- `/player/:path*`
- `/choose-plan`

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org)
- [Firebase](https://firebase.google.com)
- [Stripe](https://stripe.com)
