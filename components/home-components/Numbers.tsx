import React from 'react'
import styles from "../../app/page.module.css"

interface NumbersProp {
  icon: React.ReactNode; 
  icon2?: React.ReactNode;
  numberOfIcons: number;
  iconClassName?: string;
  title: string;
  subtitle: string;
}

const Numbers = ({ icon, icon2, numberOfIcons, iconClassName, title, subtitle }: NumbersProp) => {
  function displayNumberOfIcons(): React.ReactNode[] {
    return new Array(numberOfIcons).fill(0).map((_, index) => (
      <React.Fragment key={index} >
        {icon}
      </React.Fragment>
    ))
  }

  return (
    <div className={styles["numbers"]}>
      <div className={`${styles["numbers__icon"]} ${iconClassName || ""}`}>
        {displayNumberOfIcons()}
        {icon2}
      </div>
      <div className={styles["numbers__title"]}>{title}</div>
      <div className={styles["numbers__sub--title"]}>{subtitle}</div>
    </div>
  )
}

export default Numbers