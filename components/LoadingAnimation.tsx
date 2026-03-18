import React from 'react'
import "../app/globals.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingAnimationProp {
  message?: string;
  fontSize: number;
  color: string;
}

const LoadingAnimation = ({message, fontSize, color}: LoadingAnimationProp) => {
  return (
    <div className='loading-content'>
      <div className='loading-message'>
        {message}
      </div>

      <figure 
      className='loading-3Quarters'
      style={{
        fontSize,
        color,
      }} >
        <AiOutlineLoading3Quarters />
      </figure>
      
    </div>
  )
}

export default LoadingAnimation