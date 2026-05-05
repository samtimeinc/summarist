

import MyLibraryPageClient from './MyLibraryPageClient'
import { cookies } from 'next/headers'
import { db, auth } from '@/lib/firebase/firebase-admin'
import LoginToAccount from "@/components/GatekeeperLogin"
import { Book } from '@/types/book'



const page = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('firebase-auth-token')?.value;

    if (!token) {
        return (
            <LoginToAccount />
        )
    }

    try {
        // Verify the token with Admin SDK to get the real uid
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // Fetch the specific "list" document from the subcollections
        const savedBooksRef = db
            .collection("libraries")
            .doc(uid)
            .collection("saved_books")
            .doc("list");

        const finishedBooksRef = db
            .collection("libraries")
            .doc(uid)
            .collection("finished_books")
            .doc("list");

        // Run both queries in parallel for better performance
        const [savedSnapshot, finishedSnapshot] = await Promise.all([
            savedBooksRef.get(),
            finishedBooksRef.get(),
        ]);

        const saved = savedSnapshot.data()?.books || [];
        const finished = finishedSnapshot.data()?.books || [];

        const savedSorted = saved.toSorted(
            (a: Book, b: Book) => 
                a.title.localeCompare(b.title)
        );
        const finishedSorted = finished.toSorted(
            (a: Book, b: Book) => 
                a.title.localeCompare(b.title)
        );

        return (
            <MyLibraryPageClient 
                savedBooks={savedSorted} 
                finishedBooks={finishedSorted} 
            />
        )

    } catch (error) {
        console.error("Auth/Firestore Error: ", error);
        return (
            <div>
                Session expired. Please log in again.
            </div>
        )
    } 
}

export default page