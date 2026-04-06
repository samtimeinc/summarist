import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { addToast } from "@/lib/redux/toastSlice";

export const useCheckSubscription = () => {
    const tier = useSelector((state: RootState) => state.subscription.tier);
    const router = useRouter();
    const dispatch = useDispatch();

    const checkSubscription = (subscriptionRequired: boolean): boolean => {
        if (subscriptionRequired && tier !== "premium") {
            router.push("/settings")
            dispatch(
                addToast(
                    { 
                        title: "Premium plan required", 
                        message: "Please upgrade your plan", 
                        type: "info"
                    }
                )
            )
            return false;
        }
        return true;
    }    
    return {checkSubscription};
}
