
import "../app/globals.css"
import Link from "next/link";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IoSearch } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";

interface SearchProp {
    showSideBar: boolean;
    setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSideBar: () => void;
}

const Search = ({showSideBar, setShowSideBar, toggleSideBar}: SearchProp) => {
        const width = useWindowWidth();

    
    return (
        <div className='search__background'>
            <div className='search__wrapper'>
                <Link className="search__logo" href={`/for-you`} >
                    {(width != null && width <= 768 && width > 600) && <img src="/logo.png" alt="logo" />}
                </Link>
                <div className='search__content'>
                    <div className='search'>
                        <div className='search__input--wrapper'>
                            <input type="text" id='search__input' className='search__input' placeholder='Search for books' />
                            <div className='search__icon'>
                                <IoSearch />
                            </div>
                        </div>
                    </div>
                    <div className='sideBar__toggle--btn' onClick={toggleSideBar}>
                        <IoIosMenu />
                    </div>
                </div>
            </div>
            
            {width != null && width <= 768 ? 
                <div className={`sideBar__overlay ${!showSideBar ? 'sideBar__overlay--hidden' : ""}`} 
                onClick={() => setShowSideBar(!showSideBar)}></div> : ""}
        </div>
    )
}

export default Search