# Better Auth + Next.js + Prisma 7 — Concept Guide

A full-stack authentication system combining Next.js (Pages Router), Better Auth, Prisma 7, and PostgreSQL. This explains the *why* behind each layer rather than exact code.

## Core Idea

Authentication splits into three concerns that are easy to conflate:
- **Identity** — who a user claims to be (email/password, OAuth provider).
- **Session** — proof identity was verified, carried forward without re-checking credentials every request.
- **Authorization** — what an authenticated identity is allowed to do.

Better Auth owns the first two. Authorization is left to the application.

## Role of Each Layer

- **Next.js (Pages Router)** — the transport layer. A catch-all API route forwards every auth request to Better Auth's handler; client pages render login/signup/dashboard.
- **Better Auth** — the authentication engine. Validates credentials, hashes passwords, issues and verifies sessions, defines the shape of auth data.
- **Prisma** — the persistence adapter. Translates Better Auth's reads/writes into SQL, so Better Auth never needs to know SQL.
- **PostgreSQL** — source of truth for users, sessions, credentials.

This layering matters: swapping the database or ORM shouldn't require touching authentication logic — only the adapter layer changes.

## Why Prisma 7 Changes the Setup

Prisma 7 moved to a new client generator, made the client's output location explicit instead of defaulted, and pushed the database connection string out of the schema file into a separate config file. Practically:
- The generated client lives wherever you point it, not automatically in `node_modules`.
- Connecting to the database becomes a *runtime* concern (a driver adapter) rather than a schema-declaration concern.
- Prisma 7 with PostgreSQL requires an explicit driver adapter rather than relying on a built-in connector.

## Authentication Flow, Conceptually

**Signup** — credentials submitted → validated → password hashed (never stored raw) → a User record created → a linked Account record stores the credential type (password vs. OAuth) → a Session is created → a signed session cookie is set.

**Login** — credentials submitted → Better Auth finds the Account tied to that identity → submitted password checked against the stored hash → success creates a new Session and cookie; failure reveals nothing beyond "invalid credentials."

**Logout** — the active Session is invalidated server-side and the cookie cleared. Logout is a server-side state change, not just clearing client storage.

**An authenticated request** — the cookie is sent automatically → the server checks whether that session is still valid (not expired, not revoked) → valid sessions attach the user to the request; invalid ones are rejected.

## Data Model, Conceptually

- **User** — durable identity: name, email, verification status.
- **Account** — one row per way a user can prove identity (password, or a specific OAuth connection). A user can have several.
- **Session** — an active, time-bound proof of authentication; a user can hold multiple concurrent sessions (multiple devices).
- **Verification** — short-lived tokens for flows that confirm ownership of something, like an email address or a password-reset request.

Separating Account from User is what makes multi-provider login (password + Google + GitHub resolving to one identity) possible without duplicating user data.

## Authentication vs. Authorization

Authentication answers "is this really who they claim to be?" Authorization answers "what is this identity permitted to do?" Better Auth stops at the first question. Treating a valid session as automatic permission for every action is a common security gap — logged-in and authorized are not the same guarantee. Role/permission checks belong in your own logic, layered on top of a confirmed session.

## Why Server-Side Verification Is Non-Negotiable

Client-side session state (what a component sees via a session hook) is for UI decisions — showing a dashboard vs. a login prompt. It proves nothing to the server, since client state can be spoofed or stale. Every protected route must independently re-validate the session before returning sensitive data — "never trust the client" applies to any auth system, not just this one.

## Security Considerations

- **Secrets** sign and verify session tokens — if leaked, sessions can be forged.
- **Session expiry** trades security for convenience: shorter sessions reduce the damage window from a stolen cookie but require more frequent logins.
- **Rate limiting** on login/signup defends against credential-stuffing and brute force — not provided by default at the infrastructure level.
- **OAuth redirect URLs** must be tightly restricted; loose redirect config is a common interception vector.
- **Verification tokens** (email confirm, password reset) should be single-use and short-lived by design.

## Setup Steps (Reference Order)

1. **Scaffold the app** — create a Next.js project with the Pages Router (not App Router), TypeScript, and Tailwind.
2. **Install dependencies** — Better Auth, Prisma, the Prisma client, and a PostgreSQL driver adapter.
3. **Initialize Prisma** — sets up the `prisma/` folder and a starting schema file.
4. **Set environment variables** — database connection string, a strong random auth secret, and the app's base URL. Keep this file out of version control.
5. **Define the Prisma schema** — configure the client generator with an explicit output path (Prisma 7 requirement) and declare the PostgreSQL datasource.
6. **Create the Prisma config file** — move the database connection out of the schema and into a dedicated runtime config, as Prisma 7 expects.
7. **Set up the Prisma Client instance** — instantiate it once with a driver adapter, and reuse that single instance app-wide (avoids exhausting DB connections in dev).
8. **Configure Better Auth on the server** — point it at the Prisma adapter and enable the auth methods you need (starting with email/password).
9. **Generate the auth schema** — let Better Auth's CLI add the User, Account, Session, and Verification models to the Prisma schema.
10. **Run the database migration** — push or migrate the schema so the tables actually exist in PostgreSQL.
11. **Expose the auth API route** — a single catch-all route that hands every auth request to Better Auth's handler.
12. **Create the auth client** — the browser-side helper used by React components to sign up, sign in, sign out, and read session state.
13. **Build signup and login pages** — forms that call the client's methods and redirect on success.
14. **Read session state in the UI** — use the client's session hook to conditionally render authenticated vs. guest views.
15. **Protect API routes** — re-validate the session server-side before returning any sensitive data; never trust client-side session state alone.
16. **Run the app** and verify the full loop — signup, session persists across reload, protected route rejects unauthenticated requests, logout clears the session.

## Roadmap

1. Core identity — signup, login, logout, session.
2. Account security — email verification, password reset/change.
3. Federated identity — OAuth providers layered onto the existing Account model.
4. Authorization — roles/permissions built on top of authenticated sessions.
5. Hardening — two-factor authentication, active session management, rate limiting, monitoring.

Each phase builds on the last without changing the underlying architecture — that's the payoff of keeping authentication, persistence, and transport as separate layers from the start.
