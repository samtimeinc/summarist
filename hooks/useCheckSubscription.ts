import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";

export const useCheckSubscription = () => {
    const tier = useSelector((state: RootState) => state.subscription.tier);
    const router = useRouter();

    const checkSubscription = (subscriptionRequired: boolean): boolean => {
        if (subscriptionRequired && tier !== "premium") {
            router.push("/settings")
            return false;
        }

        return true;
    }
    
    return {checkSubscription};
}
