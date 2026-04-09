import axios from 'axios'
import { Book } from '@/types/book'
import BookPageClient from './BookPageClient';
import { notFound } from 'next/navigation';



export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let book: Book | null = null;
  
  try {
    const { data } = await axios.get<Book>(
      `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
    );
    book = data
  } catch (error) {
    console.error("Failed to fetch book: ", error);
    notFound();
  }

  // If the API succeeds but returns an empty object/null
  if (!book || Object.keys(book).length === 0) {
    notFound(); 
  }

  return <BookPageClient book={book} />;
}