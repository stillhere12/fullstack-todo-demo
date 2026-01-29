# FullTodo Application Flow (Supabase Backend)

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         CLIENT (Next.js 15)             │
│  ┌────────────────────────────────┐    │
│  │  React Components              │    │
│  │  - Auth forms                  │    │
│  │  - Notes CRUD                  │    │
│  │  - Real-time updates           │    │
│  └──────────┬─────────────────────┘    │
│             │                            │
│             │ Supabase Client SDK        │
│             ▼                            │
│  ┌────────────────────────────────┐    │
│  │  @supabase/ssr                 │    │
│  │  - createClient() (browser)    │    │
│  │  - createServerClient() (SSR)  │    │
│  └──────────┬─────────────────────┘    │
└─────────────┼─────────────────────────┘
              │ HTTPS + WebSocket
              ▼
┌─────────────────────────────────────────┐
│         SUPABASE BACKEND                │
│                                         │
│  ┌────────────────────────────────┐   │
│  │  Supabase Auth                 │   │
│  │  - Email/Password              │   │
│  │  - Google OAuth                │   │
│  │  - JWT tokens                  │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐   │
│  │  PostgreSQL + RLS              │   │
│  │  - auth.users (managed)        │   │
│  │  - public.notes (RLS)          │   │
│  │  - Auto-generated REST API     │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐   │
│  │  Realtime (WebSocket)          │   │
│  │  - Live note updates           │   │
│  │  - postgres_changes events     │   │
│  └────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐   │
│  │  Storage (Optional)            │   │
│  │  - File attachments            │   │
│  │  - RLS policies                │   │
│  └────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Authentication Flow

### Sign Up with Email
```
User → Sign Up Form → supabase.auth.signUp()
  → Supabase creates user in auth.users
  → Sends verification email
  → User verifies → auth.uid() available
  → Redirect to /notes
```

### Sign In with Google OAuth
```
User → Click Google Button → supabase.auth.signInWithOAuth({provider: 'google'})
  → Redirect to Google consent
  → User approves → Google redirects back
  → Supabase creates/updates user
  → Session created → Redirect to /notes
```

### Session Management
```
Every request → Middleware → supabase.auth.getUser()
  → If valid JWT → Continue
  → If expired → Refresh with refresh token
  → If no session → Redirect to /sign-in
```

## Database Schema

### Notes Table
```sql
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Users can only access their own notes
CREATE POLICY "notes_policy" ON public.notes
  FOR ALL USING (auth.uid() = author_id);
```

## Data Flow

### Create Note
```
1. User fills form → Submit
2. Client: supabase.from('notes').insert({ title, content, author_id })
3. Supabase:
   - Validates JWT
   - Checks RLS policy (auth.uid() = author_id)
   - Inserts into database
   - Broadcasts realtime event
4. Returns created note
5. UI updates instantly (optimistic) + realtime
```

### Read Notes
```
1. Page loads (Server Component)
2. Server: supabase.from('notes').select('*')
3. Supabase:
   - RLS automatically filters by auth.uid()
   - Returns only user's notes
4. Render notes list
5. Client subscribes to realtime updates
```

### Update Note
```
1. User edits note → Save
2. Client: supabase.from('notes').update({ title, content }).eq('id', noteId)
3. Supabase:
   - RLS ensures user owns note
   - Updates if authorized
   - Broadcasts realtime event
4. All connected clients receive update
5. UI updates across all tabs/devices
```

### Delete Note
```
1. User clicks delete → Confirm
2. Client: supabase.from('notes').delete().eq('id', noteId)
3. Supabase:
   - RLS ensures user owns note
   - Deletes if authorized
   - Broadcasts realtime event
4. Note removed from all connected clients
```

## Real-time Updates

### Setup
```typescript
// Subscribe to changes
supabase
  .channel('notes')
  .on('postgres_changes', {
    event: '*', // INSERT, UPDATE, DELETE
    schema: 'public',
    table: 'notes'
  }, (payload) => {
    // Update UI based on event type
  })
  .subscribe()
```

### Events
- **INSERT**: New note created → Add to list
- **UPDATE**: Note modified → Update in list
- **DELETE**: Note removed → Remove from list

RLS policies automatically filter realtime events - users only receive updates for their own notes.

## Key Concepts

### Row Level Security (RLS)
- Security enforced at **database level**
- Cannot be bypassed from client
- Automatic filtering in all queries
- No manual authorization checks needed in code

### Auto-generated APIs
- REST API: `supabase.from('notes').select()`
- No need to write API routes
- Type-safe with generated TypeScript types

### Realtime
- WebSocket subscriptions built-in
- Live updates across devices
- Filtered by RLS policies
- No polling needed

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── verify/page.tsx
│   ├── notes/page.tsx
│   └── auth/callback/route.ts    # OAuth callback
├── components/
│   ├── auth/
│   │   └── SignInForm.tsx
│   └── notes/
│       ├── CreateNoteForm.tsx
│       └── NoteCard.tsx
├── lib/
│   └── supabase/
│       ├── client.ts              # Browser client
│       ├── server.ts              # Server client
│       └── database.types.ts      # Generated types
├── actions/
│   └── notes.ts                   # Server actions
└── hooks/
    └── useRealtimeNotes.ts        # Real-time hook
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## Benefits Over Current Stack

| Feature | Better Auth + Prisma | Supabase |
|---------|---------------------|----------|
| Backend | 3 services | 1 unified platform |
| Auth | Manual setup | Built-in |
| Security | App-level checks | Database RLS |
| Real-time | Need external service | Built-in |
| APIs | Manual Server Actions | Auto-generated |
| Type Safety | Prisma types | Generated types |

---

**Next Steps**: Follow official [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) for setup.
