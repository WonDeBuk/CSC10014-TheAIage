import { JSX, useEffect as UseEffect, useState as UseState } from "react";
import { Navigate } from "react-router-dom";
import AxiosInstance from "@/util/AxiosInstance";

export default function RouteProtector({ children }: { children: JSX.Element }) {
    const [IsLoading, SetLoading] = UseState(true);
    const [IsAuthenticated, SetAuthenticated] = UseState(false);

    UseEffect(() => {
        AxiosInstance
            .get("/auth/me")
            .then(() => {
                SetAuthenticated(true);
                SetLoading(false);
            })
            .catch(() => {
                SetAuthenticated(false);
                SetLoading(false);
            });
    }, []);

    if (IsLoading) return <div>Loading...</div>

    return IsAuthenticated ? children : <Navigate to="/login" replace/>;
}