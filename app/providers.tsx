"use client";

import { Provider } from "react-redux";
import { store } from "../lib/redux/store";
import { AuthModalProvider } from "@/context/AuthModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthModalProvider>{children}</AuthModalProvider>
    </Provider>
  );
}
