"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";


import { jwtDecode } from "jwt-decode";
import { loginUser } from "@/app/src/services/auth";
import { redirectByRole } from "@/app/src/utils/roleRedirect";

type TokenPayload = {
  id: number;
  email: string;
  role: string;
};

export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  
const handleLogin = async () => {
  try {

    const res = await loginUser({
      email,
      password
    });

    const token = res.access_token;

    // decode JWT
    const decoded: TokenPayload = jwtDecode(token);

    // store values
    localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.role);

    toast.success("Login successful 🎉");

    // redirect by role
    router.push(redirectByRole(decoded.role));

  } catch(err) {

    toast.error("Invalid credentials");

  }
};

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">

      <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-[360px]">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>

        <div className="mb-4 flex items-center bg-white rounded-lg px-3">
          <EmailIcon className="text-gray-500"/>
          <input
            className="w-full p-2 outline-none"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6 flex items-center bg-white rounded-lg px-3">
          <LockIcon className="text-gray-500"/>
          <input
            type="password"
            className="w-full p-2 outline-none"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg transition"
        >
          <LoginIcon/>
          Login
        </button>

        <p className="text-center text-white mt-4">
          No account? <a href="/auth/register" className="underline">Register</a>
        </p>

      </div>

    </div>
  );
}