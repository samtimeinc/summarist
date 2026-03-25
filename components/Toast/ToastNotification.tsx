"use client"

import styles from "./Toast.module.css"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { removeToast } from "@/lib/redux/toastSlice";
import { useEffect } from "react";

export const ToastContainer = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  const dispatch = useDispatch<AppDispatch>();

  return (
      <div className={styles["container"]}>
    {toasts.map((toast) => (
      <div 
        key={toast.id} 
        className={`${styles["toast"]} ${styles[toast.type]}`}
        onClick={() => dispatch(removeToast(toast.id))}
      >
        {toast.message}
        {/* Auto-remove after 4 seconds */}
        <AutoTimer onExpiry={() => dispatch(removeToast(toast.id))} />
      </div>
    ))}
  </div>
  );
};

// Simple helper to handle auto-deletion
const AutoTimer = ({ onExpiry }: { onExpiry: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onExpiry, 4000);
    return () => clearTimeout(timer);
  }, [onExpiry]);
  return null;
};