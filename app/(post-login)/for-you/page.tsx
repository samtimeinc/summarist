import {Book} from "@/types/book"
import axios from 'axios';
import ForYouPageClient from "./ForYouPageClient";



export default async function ForYouPage() {
  const promises = [
    axios.get<Book[]>(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"),
    axios.get<Book[]>(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"),
    axios.get<Book[]>(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"),
  ]

  const [selBook, recBooks, suggBooks] = await Promise.all(promises);
  const selectedBook = selBook.data[0];
  const recommendedBooks = recBooks.data;
  const suggestedBooks = suggBooks.data;

  return (
    <ForYouPageClient 
      selectedBook={selectedBook} 
      recommendedBooks={recommendedBooks} 
      suggestedBooks={suggestedBooks} 
    />
  )
}
