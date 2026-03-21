import { useSelector} from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useAuthModal } from "@/context/AuthModalContext";

export const useCheckuser = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const {openModalWithRedirect} = useAuthModal();

    const checkUser = (intendedRoute: string, requireSub: boolean = false): boolean => {
        if (!user) {
            openModalWithRedirect(intendedRoute, requireSub);
            return false;
        }

        return true;
    }

    return {checkUser};
}