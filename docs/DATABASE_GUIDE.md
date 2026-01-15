# Database Guide for Beginners

## Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Next.js   │ ───▶ │   Prisma    │ ───▶ │   Neon DB   │
│    (App)    │      │   (ORM)     │      │ (PostgreSQL)│
└─────────────┘      └─────────────┘      └─────────────┘
     Code            Translator           Actual Database
```

---

## Key Concepts

### What is Prisma?
- **ORM** (Object-Relational Mapping) - translates your code to database queries
- You write `prisma.user.create()` instead of raw SQL

### What is Neon?
- **Serverless PostgreSQL** database
- Free tier available
- Works well with Vercel deployments

### What is an Adapter?
- Connects Prisma to specific databases
- For Neon: `@prisma/adapter-neon`

---

## File Structure

```
project/
├── prisma/
│   ├── schema.prisma      # Database structure (tables)
│   ├── generated/         # Auto-generated Prisma client
│   └── migrations/        # Database change history
├── prisma.config.ts       # Prisma CLI configuration
└── src/lib/prisma.ts      # Prisma client instance
```

---

## The 3 Important Files

### 1. `prisma/schema.prisma`
Defines your database structure:

```prisma
generator client {
  provider = "prisma-client"
  output   = "./generated"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    String @id
  email String @unique
  name  String
}
```

### 2. `prisma.config.ts`
Tells Prisma CLI where to find things:

```typescript
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

### 3. `src/lib/prisma.ts`
Creates the database connection:

```typescript
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/generated/client';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
export default prisma;
```

---

## Common Commands

| Command | What it does |
|---------|--------------|
| `npx prisma generate` | Creates the Prisma client code |
| `npx prisma db push` | Pushes schema to database (creates tables) |
| `npx prisma migrate dev` | Creates migration + applies it |
| `npx prisma migrate deploy` | Applies migrations (for production) |
| `npx prisma studio` | Opens visual database browser |

---

## Workflow Diagram

```
1. DEVELOP (Local)
   ┌────────────────────────────────────────┐
   │  Edit schema.prisma                    │
   │         ↓                              │
   │  npx prisma generate                   │
   │         ↓                              │
   │  npx prisma db push (or migrate dev)   │
   │         ↓                              │
   │  Test locally                          │
   └────────────────────────────────────────┘

2. DEPLOY (Vercel)
   ┌────────────────────────────────────────┐
   │  git push                              │
   │         ↓                              │
   │  Vercel runs: prisma generate          │
   │         ↓                              │
   │  Vercel runs: next build               │
   │         ↓                              │
   │  App is live!                          │
   └────────────────────────────────────────┘
```

---

## Environment Variables

### Local Development (`.env`)
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

### Vercel (Settings → Environment Variables)
```
DATABASE_URL        = (from Neon dashboard)
BETTER_AUTH_SECRET  = (random string)
BETTER_AUTH_URL     = https://your-app.vercel.app
```

---

## Common Errors & Fixes

### Error: "Table does not exist"
```
The table `public.user` does not exist
```
**Fix:** Run `npx prisma db push`

### Error: "Module not found @prisma/generated"
**Fix:** Run `npx prisma generate`

### Error: "Connection timeout"
**Fix:** Check DATABASE_URL is correct

### Error: "DATABASE_URL not set"
**Fix:** Add to `.env` file or Vercel env vars

---

## Neon Connection String

Get it from: https://console.neon.tech

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
                │         │         │        │
                │         │         │        └── Database name
                │         │         └── Neon server (use pooler!)
                │         └── Your password
                └── Your username
```

**Important:** Use the **pooled** connection (has `-pooler` in hostname)

---

## Checklist Before Deploying

- [ ] `npx prisma generate` runs without errors
- [ ] `npx prisma db push` completed (tables exist)
- [ ] `npm run build` passes locally
- [ ] Environment variables set in Vercel:
  - [ ] DATABASE_URL
  - [ ] BETTER_AUTH_SECRET
  - [ ] BETTER_AUTH_URL
- [ ] Git pushed to trigger deployment

---

## Quick Reference

```
Local Development:
  1. npm install
  2. Create .env with DATABASE_URL
  3. npx prisma generate
  4. npx prisma db push
  5. npm run dev

Deployment:
  1. Set env vars in Vercel
  2. git push
  3. Vercel auto-deploys
```
