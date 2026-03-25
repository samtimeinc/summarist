import axios from "axios";
import { Book } from "@/types/book";



export const getBooksByAuthorOrTitle = async (query: string): Promise<Book[]> => {
    // Prevent searching for empty strings
    if (!query) {
        return []
    }

    try {
        const { data } = await axios.get(
            `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`);

        return data || [];
    } catch (error) {
        console.error("Search API error:", error);
        throw error;
    }
};