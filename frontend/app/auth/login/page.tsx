"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import api from "@/app/utils/api";
import { saveToken } from "@/app/utils/auth";

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard"); // redirect if already logged in
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data);
      saveToken(res.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-96 transform hover:scale-105 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            {...register("email")}
            type="email"
            label="Email"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label="Password"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="py-2 text-lg font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}