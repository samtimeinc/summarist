import styles from "./page.module.css";
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className={styles["row"]}>
      <div className={styles["container"]}>
        <div className={styles["inner__wrapper"]}>
          
          {/* Left Half: Text and Buttons */}
          <div className={styles["inner__book--half"]}>
            <div className={styles["inner__title"]}>
              <Skeleton height="43px" width="70%" />
            </div>
            <div className={styles["inner__author"]}>
              <Skeleton height="20px" width="130px" />
            </div>
            <div className={styles["inner__subtitle"]}>
              <Skeleton height="22px" width="300px" />
            </div>
            
            <div className={styles["inner__highlights"]}>
              <div className={styles["inner__highlights--wrapper"]}>
                <div className={styles["inner__highlight"]}>
                  <Skeleton height="20px" width="152px" />
                </div>
                <div className={styles["inner__highlight"]}>
                  <Skeleton height="20px" width="152px" />
                </div>
                <div className={styles["inner__highlight"]}>
                  <Skeleton height="20px" width="152px" />
                </div>
                <div className={styles["inner__highlight"]}>
                  <Skeleton height="20px" width="152px" />
                </div>
              </div>
            </div>

            <div className={styles["inner__media--btn-wrapper"]}>
              <Skeleton height="50px" width="150px" borderRadius="4px" />
              <Skeleton height="50px" width="150px" borderRadius="4px" />
            </div>

            <div className={styles["inner__bookmark"]} >
              <Skeleton height="24px" width="214px"/>
            </div>
            
            <div className={styles["inner__about--title"]}>
              <Skeleton height="21px" width="140px" />
            </div>

            <div className={styles["inner__tags--wrapper"]}>
              <Skeleton height="50px" width="178px" />
              <Skeleton height="50px" width="178px" />
            </div>

            <div className={styles["inner__book--desc"]}>
              <Skeleton width="100%" height="220px" />
            </div>

            <div className={styles["inner__about-author--title"]}>
              <Skeleton width="100%" height="240px" />
            </div>
            <div className={styles["inner__author--desc"]}>
              <Skeleton width="100%" height="240px" />
            </div>
          </div>

          {/* Right Half: The Cover Image */}
          <div className={styles["inner__img--half"]}>
            <Skeleton width="300px" height="300px" />
          </div>
        </div>
      </div>
    </div>
  );
}