"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateToken, updateUser, logout } from "@/features/auth/authSlice";
import { userInfoAPi, refreshAccessToken } from "@/utilis/api";
import type { RootState } from "@/store/store";

export function useGetUserInfo(auto = true) {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state: RootState) => state.auth);

  const getUser = useCallback(async () => {
    try {
      let accessToken = token;

      // Redux loses the access token after a browser refresh.
      if (!accessToken) {
        accessToken = await refreshAccessToken();

        if (!accessToken) {
          dispatch(logout());
          return;
        }

        dispatch(updateToken(accessToken));
      }

      const res = await userInfoAPi.getUserInfoAPis();
      dispatch(updateUser(res.data));
    } catch {
      // Don't log out on every network error.
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (auto && !user) {
      void getUser();
    }
  }, [auto, user, getUser]);

  return { getUser };
}
