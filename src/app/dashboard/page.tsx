// this is a server component
import { getNotes } from '@/actions/notes';
import { CreateNoteForm } from '@/components/CreateNoteForm';
import { DeleteNoteButton } from '@/components/DeleteNoteButton';
import { UpdateNoteButton } from '@/components/UpdateNoteButton';
import { SignOutButton } from '../../components/SignOutButton';

export default async function NotesPage() {
  const notes = await getNotes();
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Digital Notes</h1>
          <SignOutButton />
        </header>

        {/* Form Section */}
        <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Add a New Note</h2>
          <CreateNoteForm />
        </section>

        {/* Notes List Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">Your Notes</h2>
          <ul className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <li
                key={note.id}
                className="group relative p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col justify-center items-center gap-2 md:flex-row mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{note.title}</h3>
                  <DeleteNoteButton noteId={note.id} />
                  <UpdateNoteButton noteId={note.id} />
                </div>
              </li>
            ))}
            {notes.length === 0 && (
              <p className="text-center text-slate-400 py-10 italic">
                No notes found. Add your first one above!
              </p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
