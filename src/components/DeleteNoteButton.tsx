'use client';

import { deleteNote } from '@/actions/notes';
import { useTransition } from 'react';
import { Button } from './ui/button';

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    async function handleIt() {
      await deleteNote(noteId);
    }
    // function is called immediately
    startTransition(handleIt);
  }

  return (
    <>
      {isPending ? (
        <Button variant="destructive" size="default" disabled>
          Deleting...
        </Button>
      ) : (
        <Button variant="destructive" size="default" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </>
  );
}
