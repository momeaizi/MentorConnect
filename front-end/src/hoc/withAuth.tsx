"use client"
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function withAuth<T>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/verify-email");
      }
    }, []);

    return <Component {...props} />;
  };
}