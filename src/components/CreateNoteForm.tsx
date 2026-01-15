'use client';

import { createNote } from '@/actions/notes';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function CreateNoteForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createNote(formData);

    if (result && 'error' in result) {
      setError(result.error);
    }
  }
  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" name="title" placeholder="Note title" required />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea name="content" placeholder="type something here." />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" variant="default" className="hover:cursor-pointer">
        Save Note
      </Button>
    </form>
  );
}
