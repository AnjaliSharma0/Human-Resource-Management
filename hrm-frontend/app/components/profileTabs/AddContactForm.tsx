"use client";

import api from "@/app/src/services/api";
import { useState } from "react";

import toast from "react-hot-toast";

export default function AddContactModal({ employeeId, close, reload }: any) {

  const [form,setForm] = useState({
    name:"",
    phone:"",
    relationship:""
  });

  const handleSubmit = async () => {

    try{

      await api.post(`/employees/${employeeId}/emergency-contacts`,form);

      toast.success("Contact added");

      reload();
      close();

    }catch{

      toast.error("Failed to add contact");

    }

  };

  return (

  <div className="fixed inset-0 flex items-center justify-center bg-black/40">

  <div className="bg-white p-6 rounded-xl w-[400px]">

  <h2 className="text-xl font-bold mb-4">
  Add Emergency Contact
  </h2>

  <input
  placeholder="Name"
  className="border p-2 w-full mb-3 rounded"
  onChange={(e)=>setForm({...form,name:e.target.value})}
  />

  <input
  placeholder="Phone"
  className="border p-2 w-full mb-3 rounded"
  onChange={(e)=>setForm({...form,phone:e.target.value})}
  />

  <input
  placeholder="Relationship"
  className="border p-2 w-full mb-4 rounded"
  onChange={(e)=>setForm({...form,relationship:e.target.value})}
  />

  <div className="flex gap-3">

  <button
  onClick={handleSubmit}
  className="bg-indigo-600 text-white px-4 py-2 rounded"
  >
  Add
  </button>

  <button
  onClick={close}
  className="bg-gray-300 px-4 py-2 rounded"
  >
  Cancel
  </button>

  </div>

  </div>

  </div>

  );
}