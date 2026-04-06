
import "@/app/globals.css"
import useEmblaCarousel from 'embla-carousel-react'
import { Book } from '@/types/book';
import Link from 'next/link';
import { useAudioPlayerContext } from "@/context/AudioPlayerContext";

import { CiStar, CiClock2 } from "react-icons/ci";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import BookDuration from "./BookDuration";

interface CarouselProp {
    data: Book[];
}

const EmblaCarousel = ({data}: CarouselProp) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: 'start'});

    const { formatTime } = useAudioPlayerContext();

    const goToPrev = () => emblaApi?.scrollPrev()
    const goToNext = () => emblaApi?.scrollNext()

    if (!data?.length) return null; // prevent crash if empty

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {data.map((book: Book) => (
                        <Link href={`/book/${book.id}`} key={book.id} className="embla__slide" >
                            <div className="carousel__book--wrapper">
                                {book.subscriptionRequired && <div className='premium'>Premium</div>}
                                <div className="carousel__book">
                                    <div className="carousel__book--img-wrapper">
                                        <img src={book.imageLink} className="carousel__book--img" />
                                    </div>
                                    <div className="carousel__book--title">{book.title}</div>
                                    <div className="carousel__book--author">{book.author}</div>
                                    <div className="carousel__book--subtitle">{book.subTitle}</div>
                                    <div className="carousel__book--details-wrapper">
                                        <div className="carousel__book--details">
                                            <CiClock2 className='carousel__book--icon' />
                                            <span className="carousel__book--text">
                                                <BookDuration 
                                                    audioSrc={book.audioLink} 
                                                    formatTime={formatTime} 
                                                />
                                            </span>
                                        </div>
                                        <div className="carousel__book--details">
                                            <CiStar className='carousel__book--icon' />
                                            <span className="carousel__book--text">{book.averageRating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="chevron-wrapper">
                <FaChevronCircleLeft className='chevron-left' onClick={goToPrev} />
                <FaChevronCircleRight className='chevron-right' onClick={goToNext} />
            </div>
        </div>
    )
}

export default EmblaCarousel