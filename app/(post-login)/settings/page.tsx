"use client"

import React from 'react'
import styles from "./page.module.css"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'

const SettingsPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthLoading = useSelector((state: RootState) => state.auth.loading);
    
  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>

        </div>
    </div>
  )
}

export default SettingsPage