
import "@/app/globals.css"
import React from "react";
import { usePathname, useRouter } from "next/navigation"; 
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { getErrorMessage, logoutUser } from "@/services/authService";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { useAuthModal } from "@/context/AuthModalContext";
import { addToast } from "@/lib/redux/toastSlice";
import { useFontSize } from "@/context/FontSizeContext";

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
  showLogoutConfirmation: boolean;
  setShowLogoutConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  closeSideBar: () => void;
}



function SideNavBar({ showSideBar, 
  showLogoutConfirmation, 
  setShowLogoutConfirmation, 
  closeSideBar, 
}: SideNavBarProp) {

  const pathName = usePathname();
  const width = useWindowWidth();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const {setShowModal} = useAuthModal();
  const isPlayerPage: boolean = pathName ? pathName.includes("/player") : false;
  const { fontSizeState, setFontSize } = useFontSize();

  const handleRouting = (route: string) => {
    closeSideBar();
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
      <div className='sideBar__link--wrapper enabled-link' onClick={() => setShowLogoutConfirmation(true)} >
        <div className='sideBar__link--highlighter'></div>
        <div className='sideBar__icon--wrapper' >
          <MdLogout />
        </div>
        <div className='sideBar__link--text'>Logout</div>
    </div>
    )
  }

  const displayLogoutConfirmation = () => {
    return (
      <div className="logout__confirmation">
        <div className="logout__confirmation--wrapper">
          <div className='confirmation__text--wrapper' >
            <div className='sideBar__link--highlighter '></div>
            <div className='confirmation__title'>Ready to log out?</div>
          </div>
          <div className="confirmation__button--wrapper">
            <button className="confirmation__button confirmation-green" onClick={() => handleLogout()}>Log out</button>
          </div>
          <div className="confirmation__button--wrapper">
            <button 
              className="confirmation__button confirmation-red" 
              onClick={() => {
                setShowLogoutConfirmation(false);
                setShowModal(false);
              }} >
              Cancel
            </button>
          </div>       
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      closeSideBar();
      await logoutUser();
      router.push('/for-you');
      dispatch(addToast({ 
        title: "Signed out", 
        message: "You have logged out successfully.", 
        type: "success"}));
    } catch (error) {
      closeSideBar();
      console.error("There was an issue logging out: ", error);
      const message = getErrorMessage(error) || "Log out failed.";
      dispatch(addToast({ title: "Error", message, type: "error" }))
    }
  }

  return (
    <div className={
      `sideBar 
      ${(width && width <= 768 && showSideBar) ? 'sideBar__modal' : ""} 
      ${isPlayerPage ? 'sideBar__for-player-page' : ""}`}>

      {width && width <= 768 ? 
        <div className="sideBar__modal--exit">
            <IoClose onClick={() => closeSideBar() }/>
        </div> : ""}

      <figure className='sideBar__logo'>
        {width && width > 380 ? <img src="/logo.png" alt="logo" /> : ""}
      </figure>

      <div className={`sideBar__wrapper ${isPlayerPage ? 'sideBar__wrapper-for-player-page' : ""}`}>

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

          {isPlayerPage && (
            <div className="summary__selections--wrapper">

              <div 
                className="summary__option--wrapper" 
                onClick={() => setFontSize(16)}
              >
                <div className="option__text" style={{fontSize: 16}} >Aa</div>
                <div 
                  className={`
                    option__highlight 
                    ${fontSizeState === 16 ? "option__highlight--active" : ""}
                  `}
                ></div>
              </div>

              <div 
                className="summary__option--wrapper" 
                onClick={() => setFontSize(18)} 
              >
                <div className="option__text" style={{fontSize: 18}} >Aa</div>
                <div 
                  className={`
                    option__highlight 
                    ${fontSizeState === 18 ? "option__highlight--active" : ""}
                  `}
                ></div>
              </div>

              <div 
                className="summary__option--wrapper" 
                onClick={() => setFontSize(22)}
              >
                <div className="option__text" style={{fontSize: 22}} >Aa</div>
                <div 
                  className={`
                    option__highlight 
                    ${fontSizeState === 22 ? "option__highlight--active" : ""}
                  `}
                ></div>
              </div>

              <div 
                className="summary__option--wrapper" 
                onClick={() => setFontSize(26)} 
              >
                <div className="option__text" style={{fontSize: 26}} >Aa</div>
                <div 
                  className={`
                    option__highlight 
                    ${fontSizeState === 26 ? "option__highlight--active" : ""}
                  `}
                ></div>
              </div>

            </div>
          )}

        </div>

        <div className='sideBar__bottom'>



          { showLogoutConfirmation ? (
            displayLogoutConfirmation()
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