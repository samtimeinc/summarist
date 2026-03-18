
import { db } from "@/lib/firebase/firebase";
import { doc, 
    getDoc, 
    setDoc, 
    arrayUnion, 
    arrayRemove } from "firebase/firestore";
import { Book } from "@/types/book";

// Fetch all saved books for a given user
export const fetchUserLibrary = async (userId: string): Promise<Book[]> => {
    try {
        const docRef = doc(db, "libraries", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().books ?? [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching library:", error);
        return[];
    }
}



// Helper to remove undefined fields before sending to Firestore
const sanitizeBook = (book: Book): Partial<Book> => {
    return Object.fromEntries(
        Object.entries(book).filter(([_, value]) => value !== undefined)
    ) as Partial<Book>
}



// Add a book to the user's library
export const saveBookToLibrary = async (userId: string, book: Book): Promise<void> => {
    try {
        const docRef = doc(db, "libraries", userId);
        const sanitized = sanitizeBook(book);
        await setDoc(docRef, { books: arrayUnion(sanitized) }, { merge: true });
    } catch (error) {
        console.error("Error saving book: ", error);
        throw error;
    }
}



// Remove a book from the user's library
export const removeBookFromLibrary = async (userId: string, book: Book): Promise<void> => {
    try {
        const docRef = doc(db, "libraries", userId);
        const sanitized = sanitizeBook(book)
 ;       await setDoc(docRef, { books: arrayRemove(sanitized) }, { merge: true });
    } catch (error) {
        console.error("Error removing book: ", error);
        throw error;
    }
}