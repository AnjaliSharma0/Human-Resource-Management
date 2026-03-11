"use client"; // MUST be the first line

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import api from "../utils/api";
import { useAuth } from "../context/authContext";
import Link from "next/link";

interface JwtPayload{
  id:number;
  role:string;
  email?:string;
  exp?:number;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
    
  
     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // reset error
    setLoading(true)

    try {
     const res = await api.post("/auth/login", { email, password });

if (res.data.access_token) {
  const token = res.data.access_token;
  login(token)
  // login(res.data.access_token);
  localStorage.setItem("token", token)

  // const decoded: any = jwtDecode(res.data.access_token);
// Decode JWT to get role and employee ID
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded.role === "admin") {
          router.push("/dashboard/admin");
        } else if (decoded.role === "employee") {
          // Navigate to the employee profile page using employee ID
          router.push(`/employee/${decoded.id}`);
        } else {
          setError("Invalid user role");
        }
      } else {
        setError("Login failed: No token returned");
      }
    } catch (err: any) {
      // Axios error handling
      setError(err.response?.data?.message || "Login failed");
       console.error("Login error:", err);
    }
    finally {
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
          HRM Login
        </h1>

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
              onChange={(e)=> setEmail(e.target.value)}
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
              onChange={(e)=> setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition duration-300"
        >
          <LoginIcon />
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?
          <span className="text-blue-600 font-semibold ml-1 cursor-pointer hover:underline">
            <Link href="/register">Register</Link>
          </span>
        </p>

      </form>

    </div>
  </>
  );
}