
import { db } from "@/lib/firebase/firebase";
import { doc, 
    getDoc, 
    setDoc, 
    arrayUnion, 
    arrayRemove } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { Book } from "@/types/book";



// Fetch all saved books for a given user
export const fetchUserLibraries = async (userId: string): Promise<{ saved: Book[], finished: Book[] }> => {
    try {
        const savedDocRef = doc(db, "libraries", userId, "saved_books", "list");
        const finishedDocRef = doc(db, "libraries", userId, "finished_books", "list");

        const [savedDocSnap, finishedDocSnap] = await Promise.all([
            getDoc(savedDocRef),
            getDoc(finishedDocRef),
        ]);

        return {
            saved: savedDocSnap.data()?.books ?? [],
            finished: finishedDocSnap.data()?.books ?? [],
        }
    } catch (error) {
        console.error("Error fetching user library:", error);
        return {
            saved: [],
            finished: [],
        };
    }
};



// Helper to remove undefined fields before sending to Firestore
const sanitizeBook = (book: Book): Partial<Book> => {
    return Object.fromEntries(
        Object.entries(book).filter(([_, value]) => value !== undefined)
    ) as Partial<Book>;
};



// Add a book to the user's library
export const saveBookToLibrary = async (userId: string, book: Book): Promise<void> => {
    try {
        const docRef = doc(db, "libraries", userId, "saved_books", "list");
        const sanitized = sanitizeBook(book);
        await setDoc(docRef, { books: arrayUnion(sanitized) }, { merge: true });
    } catch (error) {
        console.error("Error saving book to saved books: ", error);
        throw error;
    }
};



// Add a book that user has completely to list of finished books
export const saveBookToFinished = async (userId: string, book: Book): Promise<void> => {
    try {
        const finishedRef = doc(db, "libraries", userId, "finished_books", "list");
        const savedRef = doc(db, "libraries", userId, "saved_books", "list");
        const sanitized = sanitizeBook(book);
        await Promise.all([
            setDoc(finishedRef, { books: arrayUnion(sanitized) }, { merge: true }),
            setDoc(savedRef, { books: arrayRemove(sanitized) }, { merge: true }),
        ]);
    } catch (error) {
        console.error("Error moving book to finished: ", error);
        throw error;
    }
}



// Remove a book from the user's library
export const removeBookFromLibrary = async (userId: string, book: Book): Promise<void> => {
    try {
        const docRef = doc(db, "libraries", userId, "saved_books", "list");
        const sanitized = sanitizeBook(book)
 ;       await setDoc(docRef, { books: arrayRemove(sanitized) }, { merge: true });
    } catch (error) {
        console.error("Error removing book from saved books: ", error);
        throw error;
    }
};



export const subscribeToSavedLibrary = (userId: string, onUpdate: (books: Book[]) => void) => {
    const savedDocRef = doc(db, "libraries", userId, "saved_books", "list");

    return onSnapshot(savedDocRef, (docSnap) => {
        if (docSnap.exists()) {
            onUpdate(docSnap.data().books ?? []);
        } else {
            onUpdate([]);
        }
    }, (error) => {
        console.error("Library subscription error:", error);
    });
};



export const subscribeToFinishedLibrary = (userId: string, onUpdate: (books: Book[]) => void) => {
    const finishedDocRef = doc(db, "libraries", userId, "finished_books", "list");

    return onSnapshot(finishedDocRef, (docSnap) => {
        if (docSnap.exists()) {
            onUpdate(docSnap.data().books ?? []);
        } else {
            onUpdate([]);
        }
    }, (error) => {
        console.error("Finished Lib Subscription error: ", error);
    })
}