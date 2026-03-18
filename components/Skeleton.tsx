import "../app/globals.css";

interface SkeletonProp {
    height: string;
    width: string;
    borderRadius?: string;
    marginBottom?: string;
    message?: string;
}

const Skeleton = ({height, width, borderRadius, marginBottom, message}: SkeletonProp) => {
  return (
    <div 
    className="skeleton-box"
    style={{
        height,
        width,
        borderRadius,
        marginBottom,
    }} >
      <div className="skeleton-message">
        {message}
      </div>
    </div>
  )
}

export default Skeleton