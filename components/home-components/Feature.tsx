import React from 'react'
import styles from "../../app/page.module.css"

interface FeaturesProp {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const Feature = ({ icon, title, subtitle }: FeaturesProp) => {
  return (
    <div className={styles["features"]}>
      <div className={styles["features__icon"]}>
        {icon}
      </div>
      <div className={styles["features__title"]}>
        {title}
      </div>
      <div className={styles["features__sub--title"]}>
        {subtitle}
      </div>
    </div>
  )
}

export default Feature