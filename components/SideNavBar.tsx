'use client'

import "@/app/globals.css"
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation"; 
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { logoutUser, throwError } from "@/services/authService";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useAuthModal } from "@/context/AuthModalContext";
import { AiOutlineHome } from "react-icons/ai";
import { RiBallPenLine } from "react-icons/ri";
import { IoSettingsOutline, 
  IoClose, 
  IoHelpCircleOutline, 
  IoSearch, 
  IoBookmarkOutline  } from "react-icons/io5";
import { MdLogout, MdLogin  } from "react-icons/md";

interface SideNavBarProp {
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideNavBar({showSideBar, setShowSideBar}: SideNavBarProp) {
  const pathName = usePathname();
  const width = useWindowWidth();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const {setShowModal} = useAuthModal();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false);

  const handleRouting = (route: string) => {
    setShowSideBar(false);
    router.push(route);
  }

  const displayLoginLink = () => {
    return (
      <div className='enabled-link sideBar__link--login' onClick={() => setShowModal(true)} >
        <div className="sideBar__login--content">

        <div className='sideBar__link--highlighter'></div>
        <div className='sideBar__icon--wrapper' >
          <MdLogin />
        </div>
        <div className='sideBar__link--text'>Login</div>
        </div>
      </div>
    )
  }
  
  const displayLogoutLink = () => {
    return (
      <div className='sideBar__link--wrapper enabled-link' onClick={() => setShowLogoutConfirmation(!showLogoutConfirmation)} >
        <div className='sideBar__link--highlighter'></div>
        <div className='sideBar__icon--wrapper' >
          <MdLogout />
        </div>
        <div className='sideBar__link--text'>Logout</div>
    </div>
    )
  }

  const displayConfirmation = () => {
    return (
      <div className="logout-confirmation">
        <div className="logout__confirmation--wrapper">
          <div className='confirmation__text--wrapper' >
            <div className='sideBar__link--highlighter sideBar__link--activeHighlighter'></div>
            <div className='sideBar__link--text'>Ready to log out?</div>
          </div>
          <div className="confirmation__button--wrapper">
            <button className="confirmation__button confirmation-green" onClick={() => handleLogout()}>Log out</button>
          </div>
          <div className="confirmation__button--wrapper">
            <button 
            className="confirmation__button confirmation-red" 
            onClick={() => setShowLogoutConfirmation(!showLogoutConfirmation)} >Cancel</button>
          </div>       
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      setShowLogoutConfirmation(false);
      console.log(user);
      await logoutUser();
      router.push('/sign-in');
    } catch (error) {
      setShowLogoutConfirmation(false);
      const message = throwError(error);
      alert(`There was an issuing logging out. Please try again.\n\n${message}`)
    }
  }

  return (
    <div className={`sideBar ${(width && width <= 768 && showSideBar) ? 'sideBar__modal' : ""}`}>
      {width && width <= 768 ? 
        <div className="sideBar__modal--exit">
            <IoClose onClick={() => setShowSideBar(!showSideBar)}/>
        </div> : ""}

      <figure className='sideBar__logo'>
        {width && width > 380 ? <img src="/logo.png" alt="logo" /> : ""}
      </figure>

      <div className='sideBar__wrapper'>

        <div className='sideBar__top'>
          <div className='sideBar__link--wrapper enabled-link' onClick={() => handleRouting("/for-you")} >
            <div className={pathName === "/for-you" ? ('sideBar__link--activeHighlighter') : ('sideBar__link--highlighter')} ></div>
            <div className='sideBar__icon--wrapper'>
              <AiOutlineHome />
            </div>
            <div className='sideBar__link--text'>For You</div>
          </div>

          <div className='sideBar__link--wrapper enabled-link' onClick={() => handleRouting("/my-library")} >
            <div className={pathName === "/my-library" ? ('sideBar__link--activeHighlighter') : ('sideBar__link--highlighter')} ></div>
            <div className='sideBar__icon--wrapper'>
              <IoBookmarkOutline />
            </div>
            <div className='sideBar__link--text'>My Library</div>
          </div>

          <div className='sideBar__link--wrapper disabled-link' onClick={() => handleRouting("/highlights")} >
            <div className={pathName === "/highlights" ? ('sideBar__link--activeHighlighter') : ('sideBar__link--highlighter')} ></div>
            <div className='sideBar__icon--wrapper'>
              <RiBallPenLine />
            </div>
            <div className='sideBar__link--text'>Highlights</div>
          </div>

          <div className='sideBar__link--wrapper disabled-link' onClick={() => handleRouting("/search")} >
            <div className={pathName === "/search" ? ('sideBar__link--activeHighlighter') : ('sideBar__link--highlighter')} ></div>
            <div className='sideBar__icon--wrapper'>
              <IoSearch />
            </div>
            <div className='sideBar__link--text'>Search</div>
          </div>

        </div>

        <div className='sideBar__bottom'>



          { showLogoutConfirmation ? (
            displayConfirmation()
          ) : (

            <>
             <div className='sideBar__link--wrapper enabled-link' onClick={() => handleRouting("/settings")} >
                <div className={pathName === "/settings" ? ('sideBar__link--activeHighlighter') : ('sideBar__link--highlighter')} ></div>
                <div className='sideBar__icon--wrapper'>
                  <IoSettingsOutline />
                </div>
                <div className='sideBar__link--text'>Settings</div>
              </div>

              <div className='sideBar__link--wrapper disabled-link' onClick={() => handleRouting("/help")} >
                <div className={pathName === "/help" ? ('sideBar__link--activeHighlighter') : ('sideBar__link--highlighter')} ></div>
                <div className='sideBar__icon--wrapper'>
                  <IoHelpCircleOutline />
                </div>
                <div className='sideBar__link--text'>Help & Support</div>
              </div>

              {user ? displayLogoutLink() : displayLoginLink()}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default SideNavBar
