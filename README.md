# Better Auth

A modern authentication application built with **Next.js, TypeScript,
Tailwind CSS, shadcn/ui, Better Auth, Prisma, PostgreSQL, and Resend**.

The project provides a complete authentication flow with email/password
authentication, email verification, password reset, Google OAuth, GitHub
OAuth, protected dashboard access, session management, and a clean
responsive UI.

## ✨ Features

-   🔐 Email & password authentication
-   📧 Email verification after signup
-   🔑 Forgot password / reset password flow
-   🔵 Google OAuth login
-   ⚫ GitHub OAuth login
-   🔗 Social account linking
-   🛡️ Protected dashboard
-   👤 User profile information
-   🚪 Secure sign out
-   ⏱️ Session expiration and session management
-   📱 Responsive UI
-   🌙 Tailwind CSS styling with shadcn/ui components
-   🗄️ PostgreSQL database with Prisma
-   ✉️ Transactional emails with Resend

## 🛠️ Tech Stack

The project uses the following technologies:

-   **Next.js 16**
-   **TypeScript**
-   **Tailwind CSS**
-   **shadcn/ui**
-   **Better Auth 1.7.2**
-   **Prisma**
-   **PostgreSQL**
-   **Resend**
-   **Lucide React**
-   **Google OAuth**
-   **GitHub OAuth**

## 📁 Project Structure

``` text
my-app/
├── components/
│   ├── ui/
│   └── ...
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── email.ts
│   ├── prisma.ts
│   └── social-login.ts
├── pages/
│   ├── api/
│   │   └── auth/
│   ├── dashboard.tsx
│   ├── forgot-password.tsx
│   ├── login.tsx
│   ├── profile.tsx
│   ├── reset-password.tsx
│   ├── signup.tsx
│   └── ...
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

``` bash
git clone <your-repository-url>
cd my-app
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

``` env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"

BETTER_AUTH_SECRET="your-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

RESEND_API_KEY="re_your-api-key"
```

> Never commit `.env.local` or expose OAuth client secrets and API keys.

## 🗄️ Database Setup

Make sure PostgreSQL is running locally.

Then run the Prisma migration:

``` bash
npx prisma migrate dev
```

Generate the Prisma client if required:

``` bash
npx prisma generate
```

## 🔐 Better Auth Configuration

Better Auth is configured for:

-   Email/password authentication
-   Required email verification
-   Google OAuth
-   GitHub OAuth
-   Session management
-   Password reset emails
-   Verification emails

The main server-side configuration is located at:

``` text
lib/auth.ts
```

The client-side Better Auth instance is located at:

``` text
lib/auth-client.ts
```

Social authentication is reusable through:

``` text
lib/social-login.ts
```

## 📧 Email Verification

Email verification is enabled during signup.

The flow is:

``` text
User signs up
      ↓
Better Auth creates the account
      ↓
Verification email is generated
      ↓
Resend sends the email
      ↓
User clicks verification link
      ↓
Email becomes verified
      ↓
User can access protected functionality
```

The email implementation is located in:

``` text
lib/email.ts
```

### Resend development limitation

When using Resend without a verified sending domain, testing emails may
only be sent to the email address allowed by Resend's testing mode.

For production use, verify a domain in Resend and use a sender address
from that verified domain, for example:

``` text
Better Auth <auth@yourdomain.com>
```

## 🔵 Google OAuth Setup

Create an OAuth application in Google Cloud and add your credentials to
`.env.local`.

For local development, configure the authorized redirect URI as:

``` text
http://localhost:3000/api/auth/callback/google
```

Then set:

``` env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## ⚫ GitHub OAuth Setup

Create an OAuth application in GitHub and configure:

``` env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

For local development, use:

``` text
http://localhost:3000/api/auth/callback/github
```

Make sure the GitHub OAuth application is configured to provide the
user's email address.

## ▶️ Run the Development Server

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

## 🏗️ Production Build

Create a production build:

``` bash
npm run build
```

Run the production server:

``` bash
npm start
```

## 🧪 Authentication Flow

### Email/Password

``` text
Signup
  ↓
Email verification
  ↓
Verify email
  ↓
Login
  ↓
Dashboard
```

### Google

``` text
Login
  ↓
Google OAuth
  ↓
Google callback
  ↓
Better Auth session
  ↓
Dashboard
```

### GitHub

``` text
Login
  ↓
GitHub OAuth
  ↓
GitHub callback
  ↓
Better Auth session
  ↓
Dashboard
```

### Password Reset

``` text
Forgot Password
  ↓
Enter email
  ↓
Reset email
  ↓
Open reset link
  ↓
Set new password
  ↓
Login
```

## 🛡️ Security Notes

-   Keep `BETTER_AUTH_SECRET` private.
-   Keep Google and GitHub client secrets private.
-   Keep `RESEND_API_KEY` private.
-   Never commit `.env.local`.
-   Use HTTPS in production.
-   Configure OAuth redirect URLs for your production domain.
-   Use a verified email-sending domain for production email delivery.
-   Use a strong, persistent Better Auth secret.

## 📌 Available Pages

  Route                Purpose
  -------------------- ---------------------------------
  `/`                  Landing page
  `/login`             Email/password and social login
  `/signup`            Account registration
  `/forgot-password`   Request password reset
  `/reset-password`    Set a new password
  `/verify-email`      Email verification UI
  `/dashboard`         Protected user dashboard
  `/profile`           User profile

## 🔌 Authentication API

Better Auth exposes its authentication API through:

``` text
/api/auth/*
```

Examples include:

``` text
/api/auth/sign-up/email
/api/auth/sign-in/email
/api/auth/sign-in/social
/api/auth/callback/google
/api/auth/callback/github
```

## 🎨 UI

The interface uses:

-   Tailwind CSS
-   shadcn/ui
-   Lucide React icons
-   Responsive layouts
-   Light/dark theme-compatible styling

Authentication components are designed to be reusable across login and
signup flows.

## 📦 Useful Commands

``` bash
# Development
npm run dev

# Production build
npm run build

# Production server
npm start

# Prisma migration
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Check installed Better Auth version
npm list better-auth
```

## 🚧 Future Improvements

Potential additions include:

-   Two-factor authentication (2FA)
-   Passkeys / WebAuthn
-   Email change verification
-   Account deletion
-   Active session management
-   Revoke individual sessions
-   Avatar upload
-   Profile editing
-   Rate limiting
-   CAPTCHA / bot protection
-   Security activity logs
-   Admin authentication and user management

