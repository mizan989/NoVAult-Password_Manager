# NoVAult

**Nothing to see. Everything to protect.**

A zero-knowledge password manager and secure digital vault. Passwords and notes are encrypted with AES-256-GCM using a key derived (via Argon2id) from your Master Password — a secret the server never stores.

---

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Framer Motion + TanStack Query + React Hook Form + Zod
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** Google OAuth, Email + OTP, JWT (access + refresh), HTTP-only cookies
- **Crypto:** AES-256-GCM (data), Argon2id (key derivation + master password hashing)
- **Email:** Resend

## Folder Structure

```
NoVAult/
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── Layout/        # Sidebar, Navbar, AppLayout
│       │   ├── Vault/         # VaultItemCard, AddVaultItemModal
│       │   ├── Auth/          # ProtectedRoute guards
│       │   └── UI/            # Button, Input
│       ├── pages/              # Landing, Login, Register, Dashboard, Vault, etc.
│       ├── hooks/               # useAuth, useVaultUnlock
│       ├── services/            # api.ts, authService.ts, vaultService.ts
│       ├── types/                # shared TS types
│       └── utils/                 # passwordStrength.ts
│
└── server/                    # Express backend
    └── src/
        ├── config/            # env.ts, db.ts
        ├── models/            # User, Vault, OtpToken (Mongoose schemas)
        ├── controllers/       # authController, vaultController, generatorController
        ├── routes/            # authRoutes, vaultRoutes, generatorRoutes
        ├── middleware/        # auth, rateLimiter, validate, errorHandler
        ├── services/           # tokenService, emailService
        ├── encryption/         # argon2.ts, crypto.ts  <- the core crypto engine
        └── utils/                # ApiError, ApiResponse, asyncHandler, passwordGenerator
```

## How the encryption actually works

1. User creates a **Master Password** (separate from their login password).
2. Server generates a random per-user **salt** and stores `Argon2id(masterPassword)` as a hash for login verification only.
3. To read/write vault items, the client sends the master password over HTTPS in the `x-master-password` header on each vault request (never stored client-side beyond memory, never in localStorage).
4. The server re-derives the 32-byte AES key on the fly: `Argon2id(masterPassword + pepper, salt) -> key`. The key is **never persisted** — not in the DB, not in a session store.
5. Each vault item is encrypted individually with **AES-256-GCM** using a **fresh random IV** per write. Ciphertext, IV, and auth tag are stored in MongoDB; plaintext never touches the database.
6. Editing an item pushes the previous ciphertext into a `history[]` array before overwriting (password history).

This means: if the database leaks, an attacker gets ciphertext + IVs + auth tags — useless without each user's master password, which the server never stores in reversible form.

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env     # fill in MONGO_URI, JWT secrets, RESEND_API_KEY, etc.
npm install
npm run dev               # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000` (see `client/vite.config.ts`).

### 3. MongoDB

Use a free MongoDB Atlas cluster, or run MongoDB locally and point `MONGO_URI` at it.

### 4. Google OAuth (optional for local dev)

Create OAuth credentials in Google Cloud Console, add `http://localhost:5173` as an authorized origin, and set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `server/.env`. Wire up `@react-oauth/google` (or Google Identity Services script) on the frontend to obtain an `idToken`, then POST it to `/api/auth/google`.

### 5. Email (OTP delivery)

Set `RESEND_API_KEY` in `server/.env`. Without it, OTP codes are logged to the server console instead of emailed — handy for local development.

## What's implemented vs. what's next

**Implemented (Phases 1–5 of the roadmap):**
- Email registration + OTP verification, email/password login, JWT access + refresh tokens in HTTP-only cookies
- Google OAuth endpoint with automatic account linking on matching email
- Master password creation + verification, Argon2id key derivation, AES-256-GCM encrypt/decrypt
- Vault CRUD (passwords + secure notes), per-item history, favourites, categories, in-memory search
- Password generator with configurable charset + strength scoring
- "Invisible Vault" UI: collapsed sidebar that expands on hover, expanding search, hover-reveal card actions, decrypt-style reveal animation on passwords, 200–250ms transitions throughout

**Not yet wired (left as clean extension points):**
- Frontend Google Sign-In button (backend endpoint is ready; needs `@react-oauth/google` on the client)
- Payment cards / API keys / SSH keys / identity documents (the `Vault` model's `type` field already supports extending beyond `password`/`note`)
- File attachments, passkeys, browser extension, desktop/mobile apps
- Deployment configs for Vercel/Render (see roadmap in the original spec — the app is structured to deploy as-is: `client` → Vercel, `server` → Render, `MONGO_URI` → Atlas)

## Security notes

- `helmet`, CORS locked to `CLIENT_URL`, rate limiting (general + stricter on auth routes), Zod validation on every input.
- Passwords/notes are never logged, and the master password never leaves the request headers into any stored document.
- Swap `ENCRYPTION_PEPPER` and all JWT/cookie secrets before deploying — the `.env.example` placeholders are for local dev only.
