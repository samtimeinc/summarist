import React from 'react'
import styles from "../../app/page.module.css"

interface FooterBlockProp {
    title: string;
    link1: string;
    link2?: string;
    link3?: string;
    link4?: string;
    link5?: string;
}

const FooterBlock = ({ title, link1, link2, link3, link4, link5 }: FooterBlockProp) => {
  return (
    <div className={styles["footer__block"]}>
        <div className={styles["footer__link--title"]}>
            {title}
        </div>
        <div>
            
            <div className={styles["footer__link--wrapper"]}>
                <a className={styles["footer__link"]}>
                    {link1}
                </a>
            </div>

            <div className={styles["footer__link--wrapper"]}>
                <a className={styles["footer__link"]}>
                    {link2}
                </a>
            </div>

            <div className={styles["footer__link--wrapper"]}>
                <a className={styles["footer__link"]}>
                    {link3}
                </a>
            </div>

            <div className={styles["footer__link--wrapper"]}>
                <a className={styles["footer__link"]}>
                    {link4}
                </a>
            </div>

            <div className={styles["footer__link--wrapper"]}>
                <a className={styles["footer__link"]}>
                    {link5}
                </a>
            </div>

        </div>
    </div>
  )
}

export default FooterBlock