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
│   ├── auth/                       # Authentication pages
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── layout.tsx
│   │
│   ├── dashboard/                  # Protected dashboard
│   │   ├── components/
│   │   │   ├── TablePagination.tsx
│   │   │   ├── UserFormModal.tsx
│   │   │   ├── UserRow.tsx
│   │   │   └── UserTable.tsx
│   │   └── page.tsx
│   │
│   ├── hooks/
│   │   └── useUsers.ts             # Custom React Query hook for users
│   │
│   ├── types/
│   │   └── user.ts                 # Shared user type definitions
│   │
│   ├── favicon.ico
│   ├── globals.css                 # Global Tailwind and theme styles
│   ├── layout.tsx                  # Root layout (providers, metadata)
│   ├── page.tsx                    # Default route → redirects to /dashboard
│   └── components.tsx              # Global app-level components
│
├── lib/                            # Core logic and utilities
│   ├── api.ts                      # Axios client with JWT interceptor
│   ├── auth.ts                     # Auth API (login/register/refresh)
│   ├── users.ts                    # User CRUD API collection
│   └── queryClient.ts              # React Query configuration
│
├── store/
│   └── auth.store.ts               # Zustand store for auth tokens
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

- Feature-based structure (auth, dashboard, etc.)
- API abstraction through lib/api.ts and lib/auth.ts, lib/users.ts
- State isolation using Zustand (store/auth.store.ts)
- React Query caching in lib/queryClient.ts
- Dark/light theming via CSS variables
- Strong type safety via src/app/types/user.ts

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
| `register()`      | `lib/auth.ts`  | `POST /auth/register`     |
| `login()`         | `lib/auth.ts`  | `POST /auth/login`        |
| `refresh()`       | `lib/auth.ts`  | `POST /auth/refresh`      |
| `getUsers()`      | `lib/users.ts` | `GET /users?page=&limit=` |
| `createUser()`    | `lib/users.ts` | `POST /users`             |
| `updateUser()`    | `lib/users.ts` | `PATCH /users/:id`        |
| `deleteUser()`    | `lib/users.ts` | `DELETE /users/:id`       |


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

✅ Authentication (JWT + Refresh)
✅ User CRUD Dashboard with Pagination
✅ React Query + Zustand integration
✅ Tailwind 4 dark/light UI
✅ Complete testing and linting setup
