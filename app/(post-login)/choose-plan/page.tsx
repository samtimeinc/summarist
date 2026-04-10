import { RootState } from '@/lib/redux/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToast } from '@/lib/redux/toastSlice'

const ChoosePlanPage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const guest = user?.isAnonymous;
    const dispatch = useDispatch();

    // function for "Upgrade button"
    const handleUpgrade = async () => {
        if (guest) {
            dispatch(addToast({
                title: "Account Required",
                message: "Create your own Summarist account",
                type: "info",
            }));
            return;
        }

        const response = await fetch("api/checkout", {
            method: "POST",
            body: JSON.stringify({ userId: user?.uid, email: user?.email }),
        });

        const { url } = await response.json();
        if (url) {
            window.location.href = url;
        }
    }

  return (
    <div>page</div>
  )
}

export default ChoosePlanPage