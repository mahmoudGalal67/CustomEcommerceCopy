"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useRefreshMutation } from "@/services/authApi";
import { useMeQuery } from "@/services/categorySlice";
import { logout, setUser } from "@/context/authSlice";

export const AuthBootstrap = () => {
    const dispatch = useDispatch();

    const [refresh, { isSuccess: refreshSuccess, isError: refreshError }] =
        useRefreshMutation();

    const {
        data,
        isSuccess: meSuccess,
        isError: meError,
    } = useMeQuery(undefined, {
        skip: !refreshSuccess,
    });

    // Get a fresh access token using the refresh cookie
    useEffect(() => {
        refresh();
    }, [refresh]);

    // Get the authenticated user after the token has been refreshed
    useEffect(() => {
        if (meSuccess && data) {
            dispatch(setUser(data));
        }
    }, [meSuccess, data, dispatch]);

    // If refresh or /me fails, consider the user logged out
    useEffect(() => {
        if (refreshError || meError) {
            dispatch(logout());
        }
    }, [refreshError, meError, dispatch]);

    return null;
};