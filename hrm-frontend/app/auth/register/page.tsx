"use client";

import { useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { registerUser } from "@/app/src/services/auth";

export default function RegisterPage(){

  const router = useRouter();

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    role:"employee"
  });

  const handleRegister = async () => {

    try{

      await registerUser(form);

      toast.success("Account created successfully 🎉");

      router.push("/auth/login");

    }catch(err){

      toast.error("Registration failed");

    }
  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600">

      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl w-[380px] shadow-xl">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <div className="flex items-center bg-white rounded-lg px-3 mb-4">
          <PersonIcon/>
          <input
            className="p-2 w-full outline-none"
            placeholder="Name"
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 mb-4">
          <EmailIcon/>
          <input
            className="p-2 w-full outline-none"
            placeholder="Email"
            onChange={(e)=>setForm({...form,email:e.target.value})}
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 mb-4">
          <LockIcon/>
          <input
            type="password"
            className="p-2 w-full outline-none"
            placeholder="Password"
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 mb-6">
          <AdminPanelSettingsIcon/>
          <select
            className="p-2 w-full outline-none"
            onChange={(e)=>setForm({...form,role:e.target.value})}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg"
        >
          Register
        </button>

        <p className="text-center text-white mt-4">
          Already have account? <a href="/auth/login" className="underline">Login</a>
        </p>

      </div>

    </div>

  );
}