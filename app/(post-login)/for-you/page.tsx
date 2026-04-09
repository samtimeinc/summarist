import {Book} from "@/types/book"
import axios from 'axios';
import ForYouPageClient from "./ForYouPageClient";
import { notFound } from "next/navigation";



export default async function ForYouPage() {
  const promises = [
    axios.get<Book[]>(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"),
    axios.get<Book[]>(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"),
    axios.get<Book[]>(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"),
  ]

  let selectedBook: Book | null = null;
  let recommendedBooks: Book[] = [];
  let suggestedBooks: Book[] = [];


  try {
    const [selBook, recBooks, suggBooks] = await Promise.all(promises);
    selectedBook = selBook.data[0];
    recommendedBooks = recBooks.data;
    suggestedBooks = suggBooks.data;
  } catch (error) {
    console.error("Failed to fetch some or all of the data: ", error);
    notFound();
  }

  return (
    <ForYouPageClient 
      selectedBook={selectedBook} 
      recommendedBooks={recommendedBooks} 
      suggestedBooks={suggestedBooks} 
    />
  )
}
