import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateUser } from "@/features/auth/authSlice";
import { userInfoAPi } from "@/utilis/api";

export function useGetUserInfo(auto = true) {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state: any) => state.auth);

  const getUser = useCallback(async () => {
    // Don't request authenticated user data without a token.
    if (!token) return;

    try {
      const res = await userInfoAPi.getUserInfoAPis();
      dispatch(updateUser(res.data));
    } catch {
      // Avoid logging expected authentication failures.
    }
  }, [token, dispatch]);

  useEffect(() => {
    // A user already in Redux doesn't need to be fetched again.
    if (auto && !user && token) {
      void getUser();
    }
  }, [auto, user, token, getUser]);

  return { getUser };
}
