# FullTodo - Full-Stack Notes Application

A modern, feature-rich notes application built with Next.js 15 and Supabase.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Backend**: Supabase (Auth + Database + Realtime + Storage)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Deployment**: Vercel

## Features

- 🔐 Authentication (Email/Password + Google OAuth)
- 📝 CRUD operations with real-time updates
- ⚡ Live collaboration across devices
- 🔒 Row Level Security (database-level authorization)
- 🎨 Beautiful, responsive UI
- 🌙 Dark mode support (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Documentation

- **[APPLICATION_FLOW.md](./APPLICATION_FLOW.md)** - Architecture and data flow
- **[ROADMAP.md](./ROADMAP.md)** - Development roadmap
- **[Supabase Docs](https://supabase.com/docs)** - Official setup guide

## Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # React components
├── lib/
│   └── supabase/    # Supabase client utilities
├── actions/         # Server actions
└── hooks/           # React hooks (including realtime)
```

## Key Benefits of Supabase

- ✅ Unified backend (auth, database, storage, realtime)
- ✅ Row Level Security for automatic data filtering
- ✅ Real-time updates via WebSockets
- ✅ Auto-generated REST APIs
- ✅ Type-safe with generated TypeScript types
- ✅ Built-in email verification

## License

MIT
