
import "@/app/globals.css"
import Skeleton from './Skeleton'

interface CarouselSkeletonProp {
    marginBottom?: string;
}

const CarouselSkeleton = ({marginBottom}: CarouselSkeletonProp) => {

  return (
    <div className="embla__skeleton--container">
        {Array.from({ length: 5 }, (_, index) => (
            <div key={index}>
                <Skeleton height="350px" width="180px" borderRadius="4px" marginBottom={marginBottom} />
            </div>
        ))}
    </div>
  )
}

export default CarouselSkeleton