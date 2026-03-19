"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "@/app/src/services/api";

export default function EditPage() {

  const params = useParams();
  const router = useRouter();

  const type = params.type as string;
  const id = params.id as string;

  const [name, setName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let url = "";

      if (type === "department") {
        url = `/departments/${id}`;
      }

      if (type === "designation") {
        url = `/designations/${id}`;
      }

      const res = await api.get(url);
      setName(res.data.name || res.data.title);

    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  const updateData = async () => {
    try {
      let url = "";
      let payload: any = {};

      if (type === "department") {
        url = `/departments/${id}`;
        payload = { name };
      }

      if (type === "designation") {  // ✅ FIXED (was "designations")
        url = `/designations/${id}`;
        payload = { title: name };
      }

      await api.patch(url, payload);

      toast.success(`${type} updated`);
      router.push("/department");

    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">

      {/* CARD */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">

        {/* TITLE */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
          Edit {type}
        </h1>

        {/* INPUT */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {type === "department" ? "Department Name" : "Designation Title"}
          </label>

          <input
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${type} name`}
            className="border border-gray-300 p-2.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">

          <button
            onClick={updateData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg w-full transition"
          >
            Update
          </button>

          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg w-full transition"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}