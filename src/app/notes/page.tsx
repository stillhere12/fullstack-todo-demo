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
          className="group relative p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col justify-center items-center gap-2 md:flex-row mb-2">
            <h3 className="text-lg font-bold text-slate-900">{note.title}</h3>
            <DeleteNoteButton noteId={note.id} />
            <UpdateNoteButton noteId={note.id} noteTitle={note.title} noteContent={note.content} />
          </div>
        </li>
      ))}
      {notes.length === 0 && (
        <p className="text-center text-slate-400 py-10 italic">
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
        <div key={i} className="p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
          <div className="flex flex-col justify-center items-center gap-2 md:flex-row">
            <div className="h-6 w-40 bg-slate-200 rounded" />
            <div className="h-10 w-20 bg-slate-200 rounded" />
            <div className="h-10 w-20 bg-slate-200 rounded" />
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section - renders instantly */}
        <header className="mb-10 text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Digital Notes</h1>
          <SignOutButton />
        </header>

        {/* Form Section - renders instantly */}
        <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Add a New Note</h2>
          <CreateNoteForm />
        </section>

        {/* Notes List Section - streams in when ready */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">Your Notes</h2>
          <Suspense fallback={<NotesListSkeleton />}>
            <NotesList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
