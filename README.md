## 🚀 Next User Dashboard (Frontend)

A scalable, high-performance Next.js 15 + TailwindCSS 4 frontend integrated with a NestJS backend for authentication and user management (CRUD).

Designed for clean architecture, strong code quality, easy extensibility, and great UI/UX — ideal for production or technical code reviews.

## 🌟 Tech Stack

- ⚛️ Next.js 15 (App Router, TypeScript)
- 🎨 TailwindCSS 4 (modern theming + dark mode)
- 🔐 Zustand for state management (auth store)
- 🌐 Axios for REST API communication
- 🧩 React Query (TanStack) for caching and pagination
- 🧪 Jest + React Testing Library for UI and logic tests
- 🧹 ESLint + Prettier + Stylelint + Husky for code quality

## 📁 Folder Structure

```
src/
├── __tests__/                      # Jest + RTL test suite
│   ├── auth.test.ts
│   ├── sanity.test.tsx
│   ├── UserFormModal.test.tsx
│   ├── UserRow.test.tsx
│   └── UserTable.test.tsx
│
├── app/                            # Next.js App Router
│   ├── auth/                       # Authentication pages (login/register)
│   ├── dashboard/                  # Protected dashboard + UI components
│   ├── globals.css                 # Global Tailwind and theme styles
│   ├── layout.tsx                  # Root layout (providers, metadata)
│   └── page.tsx                    # Default route → redirects to /dashboard
│
├── core/                           # Domain + application rules
│   ├── domain/
│   │   └── user.ts                 # Pure user entities/DTO contracts
│   └── usecases/
│       ├── auth/
│       │   └── loginUser.ts        # login/register application services
│       └── users/
│           └── manageUsers.ts      # CRUD use-cases (get/create/update/delete)
│
├── infrastructure/                 # Framework + IO implementations
│   ├── http/
│   │   ├── apiClient.ts            # Axios client with JWT interceptor
│   │   ├── authService.ts          # REST gateway for auth
│   │   └── userService.ts          # REST gateway for user CRUD
│   └── query/
│       └── queryClient.ts          # React Query configuration
│
├── interface/                      # UI-facing adapters
│   └── hooks/
│       └── useUsersQuery.ts        # React Query hook consuming user use-case
│
├── state/
│   └── auth.store.ts               # Event-driven Zustand store for auth tokens
│
├── middleware.ts                   # Route protection middleware
│
# ──────────────────────────────────────────────
# Root configuration files
│
├── .env.local.example              # Example environment variables
│
├── eslint.config.mjs               # ESLint setup
├── stylelint.config.js             # TailwindCSS + CSS linting
├── prettier.config.js / .prettierrc  # Formatting rules
│
├── jest.config.ts                  # Jest setup
├── jest.setup.ts                   # Jest test environment config
├── jest.step.ts                    # Jest global mocks / setup steps
│
├── next.config.ts                  # Next.js build configuration
├── tailwind.config.ts              # TailwindCSS theme + plugins
├── tsconfig.json                   # TypeScript compiler configuration
│
├── package.json
├── package-lock.json
└── README.md                       # Project documentation


```

## ⚙️ Environment Setup
Create a .env.local (or .env) file in the project root:

```bash

# Basic app info
NEXT_PUBLIC_APP_NAME=Next User Dashboard
NEXT_PUBLIC_APP_ENV=development

# Backend API (NestJS server)
NEXT_PUBLIC_API_URL=<YOUR_API_URL>

# Pagination defaults (for user tables)
NEXT_PUBLIC_PAGE_SIZE=10

# Feature flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

```

## 🧩 Features

### 🔐 Authentication
 - Login and Register pages with form validation
 - JWT + Refresh token authentication flow
 - Zustand-based session store
 - Middleware route protection (redirects unauthenticated users to /auth/login)

### 📊 User Dashboard
- User Table with pagination, search, and CRUD modals
- API integration with NestJS backend
- Lazy loading and React Query caching
- Optimized rendering via React.memo and dynamic imports

### 🎨 UI/UX
- ailwindCSS 4 with @reference and CSS variables
- Adaptive light/dark themes
- Responsive card layouts and modals
- Focus rings, transitions, and accessibility best practices

## 🧪 Testing

All tests are stored under src/__tests__.
Framework: Jest + React Testing Library

Run tests:

```bash

npm run test
# or watch mode
npm run test:watch

```

Example snippet:

```tsx

import { render, screen } from '@testing-library/react';
import LoginForm from '../app/auth/components/LoginForm';

test('renders login form correctly', () => {
  render(<LoginForm />);
  expect(screen.getByText('Login')).toBeInTheDocument();
});

```

### 🧹 Code Quality Tooling

| Tool                    | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| **ESLint**              | Enforces consistent TypeScript/React standards |
| **Prettier**            | Code formatting                                |
| **Stylelint**           | TailwindCSS & CSS linting                      |
| **Husky + Lint-Staged** | Pre-commit checks                              |
| **Jest**                | Unit and integration testing                   |

Run manually:

```bash

npm run lint
npm run format
npx stylelint "**/*.css"

```

## 🚀 Scripts

| Command                    | Description                       |
| -------------------------- | --------------------------------- |
| `npm run dev`              | Start development server          |
| `npm run build`            | Build optimized production bundle |
| `npm run start`            | Serve built app                   |
| `npm run lint`             | Lint TypeScript and React files   |
| `npm run format`           | Format all files via Prettier     |
| `npm run test`             | Run Jest tests                    |
| `npx stylelint "**/*.css"` | Lint Tailwind/CSS styles          |

## 💡 Architecture Highlights

- Core-engine layering: `core/` (domain + use-cases), `infrastructure/` (gateways), `interface/` (React adapters) keeps business rules platform-agnostic.
- API abstraction via `infrastructure/http/*` centralizes retries, token refresh, and payload validation.
- Event-driven Zustand store (`state/auth.store.ts`) exposes a `dispatch` API instead of imperative setters, enabling observers (analytics, logs) later.
- React Query configuration lives in `infrastructure/query/queryClient.ts`, while feature hooks (`interface/hooks`) wrap queries for pages.
- Dark/light theming via CSS variables + Tailwind 4.
- Strong type safety via domain DTOs (`core/domain/user.ts`).

### 🎯 Why This Architecture (Design Decisions)

- **Next.js App Router + vertical slices** keeps UI files feature-scoped while delegating business logic to `core/usecases`, upholding SRP.
- **Use-case factories** (`createLoginUser`, `createDeleteUser`, etc.) make dependency injection explicit, so tests can swap gateways without React.
- **React Query hooks** live in `interface/hooks`, so transport caching remains opt-in per screen but isolated from domain logic.
- **Event-driven auth store** (dispatching `LOGIN_SUCCESS`, `TOKEN_REFRESHED`, etc.) aligns with the Open/Closed principle—new events extend behavior without mutating consumers.
- **Middleware + client guards** enforce defense-in-depth while still reading like high-level policy statements (KISS).
- **Dedicated configuration layer** (ESLint, Stylelint, Jest, Tailwind, TS) keeps code quality DRY and automated.

### ⚖️ Trade-offs

- **Layered folders** introduce more files, which can feel heavy for small teams, but they make boundaries obvious as the app grows.
- **Use-case factories** mean slightly more boilerplate up front, yet drastically simplify unit testing and refactors.
- **React Query adapters** add an indirection step versus calling `useQuery` inline, but they let server components or alternative caches reuse the same use-case.
- **Event-driven store** replaces simple setters with dispatch events, requiring devs to learn the small event vocabulary in exchange for predictable side effects.

### 📈 Scalability Considerations

- **Horizontal growth**: new features drop into `core/usecases/<feature>`, `infrastructure/<delivery>`, and optional interface adapters—no need to touch existing domains.
- **Data volume**: React Query keys (`['users', page, limit, search]`) and a dedicated `userService` keep pagination + caching logic reusable for future dashboards.
- **Team scaling**: DTOs in `core/domain` plus use-case factories create natural seams for pair ownership (one squad on domain, another on infra).
- **Extensibility**: `infrastructure/http/apiClient.ts` remains the single interception point for retries, logging, or transport swaps (REST → gRPC) while use-cases stay unchanged.

## 🔐 Backend Integration

The frontend consumes your NestJS backend endpoints as follows.

### 🔒 Auth Endpoints

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| `POST` | `/auth/register` | Register new user            |
| `POST` | `/auth/login`    | Login user and return tokens |
| `POST` | `/auth/refresh`  | Refresh access token         |


### 👥 User Endpoints

| Method   | Endpoint              | Description                 |
| -------- | --------------------- | --------------------------- |
| `GET`    | `/users`              | Get all users *(paginated)* |
| `GET`    | `/users/:id`          | Get user by ID              |
| `GET`    | `/users/email/:email` | Find user by email          |
| `PATCH`  | `/users/:id`          | Update user details         |
| `DELETE` | `/users/:id`          | Delete user                 |


## 🧩 Frontend → Backend Mapping

| Frontend Function | Source         | Backend Endpoint          |
| ----------------- | -------------- | ------------------------- |
| `registerUser()`  | `core/usecases/auth/loginUser.ts`  | `POST /auth/register`     |
| `loginUser()`     | `core/usecases/auth/loginUser.ts`  | `POST /auth/login`        |
| `token refresh`   | `infrastructure/http/apiClient.ts` | `POST /auth/refresh`      |
| `getUsersPage()`  | `core/usecases/users/manageUsers.ts` | `GET /users?page=&limit=` |
| `createUserEntry()` | `core/usecases/users/manageUsers.ts` | `POST /users`             |
| `updateUserEntry()` | `core/usecases/users/manageUsers.ts` | `PATCH /users/:id`        |
| `deleteUserEntry()` | `core/usecases/users/manageUsers.ts` | `DELETE /users/:id`       |


### 💡 Performance Features

- React Query caching reduces redundant API calls
- Dynamic imports + pagination for large user sets
- Token persistence in Zustand
- Optimized Tailwind 4 atomic classes
- Target Lighthouse Score ≥ 95

### 🧭 Deployment

Development

```bash

npm install
npm run dev

```
➡ Open http://localhost:3000

Production

```bash

npm run build
npm run start

```

### 🧠 Summary

This frontend provides a clean, scalable, and testable architecture with:

- ✅ Authentication (JWT + Refresh)
- ✅ User CRUD Dashboard with Pagination
- ✅ React Query + Zustand integration
- ✅ Tailwind 4 dark/light UI
- ✅ Complete testing and linting setup
