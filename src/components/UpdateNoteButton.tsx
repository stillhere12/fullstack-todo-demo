'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateNote } from '../actions/notes';
import { Button } from './ui/button';
import { Input } from './ui/input';

type UpdateNoteFormData = {
  title: string;
  content: string;
};

export function UpdateNoteButton(props: {
  noteId: string;
  noteTitle: string;
  noteContent: string | null;
}) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<UpdateNoteFormData>({
    defaultValues: {
      title: props.noteTitle,
      content: props.noteContent || '',
    },
  });

  async function onSubmit(data: UpdateNoteFormData) {
    await updateNote(props.noteId, data.title, data.content);
    setOpen(false);
  }

  function handleOpenChange(isOpen: boolean) {
    // isOpen is true when dialog is opened
    setOpen(isOpen);
    if (isOpen) {
      reset({
        title: props.noteTitle,
        content: props.noteContent || '',
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="default">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Note</DialogTitle>
          <DialogDescription>Make changes to your note below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" {...register('title', { required: true })} placeholder="Note title" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Input
              id="content"
              {...register('content', { required: true })}
              placeholder="Note content"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="hover:cursor-pointer">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
