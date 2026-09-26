import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "@/features/auth/authSlice";
import { userInfoAPi } from "@/utilis/api";

export function useGetUserInfo(auto = true) {
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const res = await userInfoAPi.getUserInfoAPis();
      dispatch(updateUser(res.data));
    } catch (e) {
      console.log("User fetch error:", e);
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    if (auto) getUser();
  }, []);

  return { getUser };
}
