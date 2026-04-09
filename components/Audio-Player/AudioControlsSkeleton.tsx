

import styles from "@/app/(post-login)/player/[id]/page.module.css"

import TenSecondRewindIcon from "../TenSecondRewindIcon";
import TenSecondFForwardIcon from "../TenSecondFForwardIcon";
import { FaPause, FaPlay } from "react-icons/fa";



export const AudioControlsSkeleton = () => {

    return (
        <div className={styles["audio__controls--wrapper"]}>
          
            <div className={styles["audio__controls"]}>
                <button className={styles["audio__controls--btn"]}>
                    <TenSecondRewindIcon />
                </button>
                <button 
                    className={`
                        ${styles["audio__controls--btn"]} 
                        ${styles["audio__controls--btn-play"]}`} 
                    >
                        <FaPlay className={styles["audio__controls--play-icon"]} />
                </button>
                <button className={styles["audio__controls--btn"]}>
                    <TenSecondFForwardIcon />
                </button>
            </div>
      </div>
    )
}