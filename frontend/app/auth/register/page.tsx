"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { TextField, Button, InputAdornment } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import api from "@/app/utils/api";

type RegisterForm = { name: string; email: string; password: string };

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/auth/register", data);
      router.push("/auth/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-teal-600">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-96 transform hover:scale-105 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            {...register("name")}
            label="Name"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

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
            type="password"
            label="Password"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            className="py-2 text-lg font-semibold hover:bg-green-700 transition-all duration-300"
          >
            Register
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-green-600 font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}