
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserLibrary } from "@/services/libraryService";
import { Book } from "@/types/book";



export const getLibrary = createAsyncThunk(
  "library/fetchUserLibrary",
  async(userId: string, {rejectWithValue}) => {
    try {
      const books = await fetchUserLibrary(userId);
      return books;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch library");
    }
  }
)

interface LibraryState {
  books: Book[];
  loading: boolean;
  error: string | null;
};

const initialState: LibraryState = {
  books: [],
  loading: false,
  error: null,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    addBook: (state, action: PayloadAction<Book>) => {
      const exists = state.books.some(book => book.id == action.payload.id);
      if (!exists) {
        state.books.push(action.payload);
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    clearBooks: (state) => {
      state.books = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {addBook, setBooks, removeBook, clearBooks} = librarySlice.actions;
export default librarySlice.reducer;