import axios from 'axios';
import { Book } from '@/types/book';
import PlayerPageClient from './PlayerPageClient';



export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 const  { data: book } = await axios.get<Book>(
  `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`);

 return <PlayerPageClient book={book} />;
}