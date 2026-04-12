"use client"

import React from 'react'
import styles from "./page.module.css"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'

const SettingsPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const tier = useSelector((state: RootState) => state.subscription.tier);
  const isAuthLoading = useSelector((state: RootState) => state.auth.loading);
        
  return (
    <div className={styles["container"]}>
        <div className={styles["row"]}>
          <div className={styles["settings__title"]}>Settings</div>

          <div className={styles["settings__content"]}>
            <div>
              <div className={styles["settings__subtitle"]}>Subscription Plan</div>
              <div 
                className={`
                  ${styles["settings__text"]} 
                  ${styles["display__tier"]}
                `}
              >
                {tier}
              </div>
            </div>
          </div>

          <div className={styles["settings__content"]}>
            <div className={styles["settings__subtitle"]}>Email</div>
            <div className={styles["settings__text"]}>{user?.email}</div>
          </div>
          
        </div>
    </div>
  )
}

export default SettingsPage