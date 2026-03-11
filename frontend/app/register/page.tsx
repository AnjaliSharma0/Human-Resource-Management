"use client"; // MUST be first line

import { useState } from "react";
import { useRouter } from "next/navigation"; // App Router compatible
import { TextField, Button, MenuItem } from "@mui/material";
import api from "../utils/api";
import { useAuth } from "../context/authContext";
import Link from "next/link";
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkIcon from "@mui/icons-material/Work";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // default
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Registration API call
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // Auto-login after registration
      const loginRes = await api.post("/auth/login", { email, password });

      if (loginRes.data.access_token) {
        login(loginRes.data.access_token);
        router.push("/dashboard/admin");
      } else {
        setError("Login failed after registration");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">

        <form className="bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-96 border border-white/30"
          onSubmit={handleSubmit}
        >

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            HRM Registeration
          </h1>
          {/* Name field */}
          <div className="mb-5">
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Name
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <BadgeIcon className="text-gray-500 mr-2" />

              <input
                type="name"
                placeholder="Enter your name"
                className="w-full outline-none bg-transparent text-black"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          {/* Email Field */}
          <div className="mb-5">
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Email
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <EmailIcon className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent text-black"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <LockIcon className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent text-black"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {/* Role Field */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 font-medium mb-1 block">
              Role
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <WorkIcon className="text-gray-500 mr-2" />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full outline-none bg-transparent text-black"
              >

                <option value="" disabled>Select role</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          {/* login Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition duration-300"
          >
            <PersonAddIcon />
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?
            <span className="text-blue-600 font-semibold ml-1 cursor-pointer hover:underline">
              <Link href="/login">Login</Link>
            </span>
          </p>

        </form>

      </div>



    </>
  );
}