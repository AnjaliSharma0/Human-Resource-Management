"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { role, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!role) {
      router.push("/login");
      return;
    }

    if (role !== "admin") {
      router.push("/dashboard/employee");
    }
  }, [role, loading, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <button
        onClick={logout}
        className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}