import { useSelector} from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useAuthModal } from "@/context/AuthModalContext";

export const useCheckUser = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const {openModalWithRedirect, setShowModal} = useAuthModal();

    const checkUser = (intendedRoute?: string, requireSub: boolean = false): boolean => {
        if (!user) {
            if (intendedRoute) {
                openModalWithRedirect(intendedRoute, requireSub);
            } else {
                setShowModal(true);
            }
            return false;
        }

        return true;
    }

    return {checkUser};
}