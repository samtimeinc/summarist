import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { addToast } from "@/lib/redux/toastSlice";



export const useCheckSubscription = () => {
    const tier = useSelector((state: RootState) => state.subscription.tier);
    const hasPremiumAccess = [
        "premium", 
        "premium-plus", 
    ].includes(tier);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const checkSubscription = (subscriptionRequired: boolean): boolean => {
        if (subscriptionRequired && !hasPremiumAccess) {
            router.push("/settings");
            dispatch(
                addToast(
                    { 
                        title: "Premium plan required", 
                        message: "Please upgrade your plan", 
                        type: "info"
                    }
                )
            );
            return false;
        }
        return true;
    }    
    return {checkSubscription};
}
