import styles from "../../app/page.module.css"

interface StatisticsHeadingProp {
  index: number;
  activeIndex: number;
  heading: string;
}

const StatisticsHeading = ({ index, activeIndex, heading }: StatisticsHeadingProp) => {
  return (
    <div className={`
    ${styles["statistics__heading"]} 
    ${index === activeIndex ? styles["statistics__heading--active"] : ""}`} >
        {heading}
    </div>
  )
}

export default StatisticsHeading