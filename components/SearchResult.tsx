import "@/app/globals.css"
import Link from "next/link"
import { Book } from "@/types/book"
import React, { useEffect, useRef } from "react"
import Skeleton from "./Skeleton"

import { CiClock2 } from "react-icons/ci";



interface SearchResultProp {
    results: Book[];
    loading: boolean;
    activeIndex: number;
}

const SearchResult = ({ results, loading, activeIndex }: SearchResultProp) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeIndex !== -1 && containerRef.current) {
            const activeElement = containerRef.current.children[activeIndex] as HTMLElement;

            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [activeIndex]);

    if (loading) {
        return (
            <div className="search__results--wrapper">
                <Skeleton height="120px" width="392px" marginBottom="8px"/>
                <Skeleton height="120px" width="392px" marginBottom="8px"/>
                <Skeleton height="120px" width="392px" marginBottom="8px"/>
            </div>
        )
    }

    if ( results.length === 0) {
        return (
            <div className="search__results--wrapper">
                <div className="search__results--none">No Books Found</div>
            </div>
        )
    }

  return (
    <div className='search__results--wrapper' ref={containerRef} >
        {results?.map((result, index) => (
            <Link 
                href={`/book/${result.id}`} 
                key={result.id}
                className={`result__link ${index === activeIndex ? "result__link--active" : ""}`} >

                <audio src={result.audioLink} />

                <figure className="result__image--wrapper">
                    <img src={result.imageLink} alt={result.title} />
                </figure>

                <div className="result__info--wrapper">
                    <div className="result__title">{result.title}</div>
                    <div className="result__author">{result.author}</div>
                    <div className="result__audio--details">
                        <CiClock2 />
                        <span>99:99</span>
                    </div>
                </div>
            </Link>
        ))}
    </div>
  )
}

export default SearchResult