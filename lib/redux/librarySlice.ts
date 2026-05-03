
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserLibraries } from "@/services/libraryService";
import { Book } from "@/types/book";



export const getLibrary = createAsyncThunk(
  "library/fetchUserLibraries",
  async(userId: string, { rejectWithValue }) => {
    try {
      return await fetchUserLibraries(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch library");
    }
  }
)

interface LibraryState {
  savedBooks: Book[];
  finishedBooks: Book[];
  loading: boolean;
  error: string | null;
};

const initialState: LibraryState = {
  savedBooks: [],
  finishedBooks: [],
  loading: false,
  error: null,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setSavedBooks: (state, action: PayloadAction<Book[]>) => {
      state.savedBooks = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFinishedBooks: (state, action: PayloadAction<Book[]>) => {
      state.finishedBooks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSavedBook: (state, action: PayloadAction<Book>) => {
      const exists = state.savedBooks.some(book => book.id == action.payload.id);
      if (!exists) {
        state.savedBooks.push(action.payload);
      }
    },
    addFinishedBook: (state, action: PayloadAction<Book>) => {
      const exists = state.finishedBooks.some(book => book.id == action.payload.id);
      if (!exists) {
        state.finishedBooks.push(action.payload);
      }
    },
    removeSavedBook: (state, action: PayloadAction<string>) => {
      state.savedBooks = state.savedBooks.filter(book => book.id !== action.payload);
    },
    removeFinishedBook: (state, action: PayloadAction<string>) => {
      state.finishedBooks = state.finishedBooks.filter(book => book.id !== action.payload);
    },
    clearBooks: (state) => {
      state.savedBooks = [];
      state.finishedBooks = [];
      state.loading = false;
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
        state.savedBooks = action.payload.saved;
        state.finishedBooks = action.payload.finished;
      })
      .addCase(getLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  addSavedBook, 
  addFinishedBook, 
  setSavedBooks, 
  setFinishedBooks, 
  removeSavedBook, 
  removeFinishedBook, 
  clearBooks
} = librarySlice.actions;

export default librarySlice.reducer;