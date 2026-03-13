"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";


export default function ProtectedRoute({ children, role }: any) {

  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {

    if (!user) {
      router.push("/auth/login");
    }

    if (role && user?.role !== role) {
      router.push("/auth/login");
    }

  }, [user]);

  return children;
}