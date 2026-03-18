import styles from "../../app/page.module.css"

interface StatisticsDataProp {
    percent: number;
    startDescription: string;
    boldDescription: string;
    endDescription: string
}

const StatisticsData = ({ percent, startDescription, boldDescription, endDescription }: StatisticsDataProp) => {
  return (
    <div className={styles["statistics__data"]}>
        <div className={styles["statistics__data--number"]}>
            {percent}%
        </div>
        <div className={styles["statistics__data--title"]}>
            {startDescription} 
            <span className={styles["bold"]}>{boldDescription}</span> 
            {endDescription}
        </div>
    </div>
  )
}

export default StatisticsData