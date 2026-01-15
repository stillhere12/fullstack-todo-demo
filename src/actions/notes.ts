'use server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
export async function alreadyPresentTitle(title: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect('/'); // Redirect to home/login if not authenticated
  }
  const noteWithTitle = await prisma.note.findFirst({
    where: {
      title: title,
      authorId: session.user.id,
    },
  });
  return noteWithTitle !== null;
}

export async function getNotes() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect('/'); // Redirect to home/login if not authenticated
  }
  const notes = await prisma.note.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  // what data type is notes ? array of objects
  return notes;
}
export async function createNote(formdata: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect('/');
  }
  const title = formdata.get('title') as string;
  if (await alreadyPresentTitle(title)) {
    // return error object
    return { error: 'Title already exists' };
  }
  const content = formdata.get('content') as string;

  if (!title) {
    throw new Error('Title is required');
  }
  const note = await prisma.note.create({
    data: {
      title,
      content,
      authorId: session.user.id,
    },
  });
  revalidatePath('/notes');
  // refresh the path after creating a note
  // what data type is note ? object
  return note;
}
export async function deleteNote(noteId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect('/');
  }
  await prisma.note.deleteMany({
    where: {
      id: noteId,
      authorId: session.user.id,
    },
  });
  revalidatePath('/notes');
}
export async function updateNote(noteId: string, title: string, content: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect('/');
  }
  await prisma.note.updateMany({
    where: {
      id: noteId,
      authorId: session.user.id,
    },
    data: {
      title,
      content,
    },
  });
  revalidatePath('/notes');
}
