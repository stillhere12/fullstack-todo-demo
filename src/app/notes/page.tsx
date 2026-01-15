// this is a server component
import { getNotes } from '@/actions/notes';
import { CreateNoteForm } from '@/components/CreateNoteForm';
import { DeleteNoteButton } from '@/components/DeleteNoteButton';
import { UpdateNoteButton } from '@/components/UpdateNoteButton';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SignOutButton } from '../../components/SignOutButton';

// Separate async component for notes - enables streaming
async function NotesList() {
  const notes = await getNotes();
  return (
    <ul className="grid grid-cols-1 gap-4">
      {notes.map((note) => (
        <li
          key={note.id}
          className="group relative p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col justify-center items-center gap-2 md:flex-row mb-2">
            <h3 className="text-lg font-bold text-foreground">{note.title}</h3>
            <DeleteNoteButton noteId={note.id} />
            <UpdateNoteButton noteId={note.id} noteTitle={note.title} noteContent={note.content} />
          </div>
        </li>
      ))}
      {notes.length === 0 && (
        <p className="text-center text-muted-foreground py-10 italic">
          No notes found. Add your first one above!
        </p>
      )}
    </ul>
  );
}

// Loading skeleton for notes
function NotesListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-xl border border-border shadow-sm animate-pulse">
          <div className="flex flex-col justify-center items-center gap-2 md:flex-row">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-10 w-20 bg-muted rounded" />
            <div className="h-10 w-20 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section - renders instantly */}
        <header className="mb-10 text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">My Digital Notes</h1>
          <SignOutButton />
        </header>

        {/* Form Section - renders instantly */}
        <section className="bg-card shadow-sm border border-border rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Add a New Note</h2>
          <CreateNoteForm />
        </section>

        {/* Notes List Section - streams in when ready */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b pb-2">Your Notes</h2>
          <Suspense fallback={<NotesListSkeleton />}>
            <NotesList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
