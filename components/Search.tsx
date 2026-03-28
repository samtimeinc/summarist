
import "@/app/globals.css"
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useDebounce } from "@/hooks/useDebounce";
import { getBooksByAuthorOrTitle } from "@/services/bookService";
import { Book } from "@/types/book";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { addToast } from "@/lib/redux/toastSlice";
import SearchResult from "./SearchResult";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";

import { IoSearch, IoClose } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";



interface SearchProp {
    toggleSideBar: () => void;
}



const Search = ({ toggleSideBar }: SearchProp) => {
        const [search, setSearch] = useState<string>("")
        const [results, setResults] = useState<Book[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [activeIndex, setActiveIndex] = useState<number>(-1)

        const width = useWindowWidth();
        const debouncedSearch = useDebounce(search, 300);
        const dispatch = useDispatch<AppDispatch>();
        const searchRef = useRef<HTMLDivElement>(null);
        const router = useRouter();

        useClickOutside(searchRef, () => {
            setResults([]);
            setSearch("");
        });

        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (results.length === 0) {
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((prev) => (prev > -1 ? prev - 1 : prev));
            } else if (event.key == "Enter") {
                if (activeIndex !== -1) {
                    const selectedBook = results[activeIndex];
                    router.push(`/book/${selectedBook.id}`);
                    setSearch("");
                    setResults([]);
                }
            }
        }

        useEffect(() => {
            setActiveIndex(-1);
        }, [results])

        useEffect(() => {
            const performSearch = async () => {
                if (debouncedSearch.trim().length > 0) {
                    setLoading(true);
                    try {
                        const books = await getBooksByAuthorOrTitle(debouncedSearch);
                        setResults(books);
                    } catch (error) {
                        console.error("There was an error with search: ", error);
                        dispatch(addToast({ message: `Error fetching search results`, type: "error"}));
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setResults([]);
                }
            }
            
            performSearch();

        }, [debouncedSearch, dispatch])

    
    return (
        <div className='search__background'>
            <div className='search__wrapper' ref={searchRef}>
                <Link className="search__logo" href={`/for-you`} >
                    {(width !== null && width <= 768 && width > 600) && <img src="/logo.png" alt="logo" />}
                </Link>
                <div className='search__content'>
                    <div className='search'>
                        <div className='search__input--wrapper'>
                            <input 
                                type="text"
                                value={search} 
                                id='search__input' 
                                className='search__input' 
                                placeholder='Search by title or author' 
                                onChange={(e) => setSearch(e.target.value)} 
                                onKeyDown={handleKeyDown}
                            />
                            <div className='search__icon'>
                                {search.length > 0 ? (
                                    <IoClose className="enabled-link" onClick={() => {
                                        setSearch("");
                                        setResults([]);
                                        setLoading(false);
                                        }}  
                                    />
                                    ) : (
                                    <IoSearch />)}
                            </div>
                        </div>
                    </div>

                    <div className='sideBar__toggle--btn' onClick={toggleSideBar}>
                        <IoIosMenu />
                    </div>
                </div>
                    {(search.length > 0 && (loading || debouncedSearch === search)) && 
                        (<SearchResult results={results} loading={loading} activeIndex={activeIndex} />) }
            </div>
        </div>
    )
}

export default Search