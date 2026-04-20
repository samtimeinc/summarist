import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { useAuthModal } from "@/context/AuthModalContext";
import { addToast } from "@/lib/redux/toastSlice";

export const useCheckUser = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const { openModalWithRedirect, setShowModal } = useAuthModal();

    const checkUserLogIn = (intendedRoute?: string, requireSub: boolean = false): boolean => {
        if (!user) { 
            if (intendedRoute) {
                openModalWithRedirect(intendedRoute, requireSub);
            } else {
                setShowModal(true);
            }
            dispatch(
                addToast(
                    { 
                        title: "Log in required", 
                        message: "Log in to view content", 
                        type: "info"
                    }
                )
            );
            return false;
        }
        return true;
    }
    return {checkUserLogIn};
}