
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "@/types/book";

interface LibraryState {
  books: Book[];
  loading: boolean;
};

const initialState: LibraryState = {
  books: [],
  loading: false,
};

export const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    clearBooks: (state) => {
      state.books = [];
    }
  }
});

export const {setBooks, addBook, removeBook, clearBooks} = librarySlice.actions;
export default librarySlice.reducer;