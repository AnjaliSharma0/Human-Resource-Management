"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/app/src/services/api";
import { useParams } from "next/navigation"; // useParams to get route params
import Loading from "@/app/components/Loading";

export default function EmployeeCard() {
  const params = useParams();
  const employeeId = Array.isArray(params.id) ? params.id[0] : params.id; // ensure string
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!employeeId) return;
    try {
      const res = await api.get(`/employees/${employeeId}`);
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [employeeId]);

  if (loading) return <Loading message="Loading profile..." size="lg"/>
  if (!profile) return <p className="p-6 text-red-500">Profile not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* Personal Info Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Personal Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 font-medium">Name</p>
            <p className="font-semibold">{profile.firstName} {profile.lastName}</p>
            <p>{profile.role}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Email</p>
            <p className="font-semibold">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Phone</p>
            <p className="font-semibold">{profile.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Gender</p>
            <p className="font-semibold">{profile.gender}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Date of Birth</p>
            <p className="font-semibold">{profile.dateOfBirth?.split("T")[0]}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500 font-medium">Address</p>
            <p className="font-semibold">{profile.address}</p>
          </div>
        </div>
      </div>

      {/* Work Info Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Work Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 font-medium">Department</p>
            <p className="font-semibold">{profile.department?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Designation</p>
            <p className="font-semibold">{profile.designation?.title}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Joining Date</p>
            <p className="font-semibold">{profile.joiningDate?.split("T")[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}