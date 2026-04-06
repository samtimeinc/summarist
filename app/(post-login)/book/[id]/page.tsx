"use server"

import axios from 'axios'
import { Book } from '@/types/book'
import BookPageClient from './BookPageClient';
import { notFound } from 'next/navigation';



export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data: book } = await axios.get<Book>(
      `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
    );

    if (!book) {
      return notFound();
    }

    return <BookPageClient book={book} />;

  } catch (error) {
      console.error("Failed to fetch book: ", error);
  }
}