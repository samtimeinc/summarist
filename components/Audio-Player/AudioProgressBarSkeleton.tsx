import inputStyles from "@/styles/progress-bar.module.css"



export const AudioProgressBarSkeleton = () => {

    return (
        <div className={inputStyles["audio__progress--wrapper"]}>
            <div className={inputStyles["audio__time"]}></div>

            <input 
                type="range" 
                id={inputStyles['track__progress--bar']} 
            />

            <div className={inputStyles["audio__time"]}>
                00:00
            </div>
            
        </div>
    )
}