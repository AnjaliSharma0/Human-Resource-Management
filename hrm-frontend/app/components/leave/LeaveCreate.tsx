"use client";

import { holidayApi } from "@/app/src/services/leave";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import DeleteHolidayModal from "../holiday/DeleteHolidayModel";




export default function HolidayPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
 const [search, setSearch] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    date: "",
  });

  const fetchHolidays = async () => {
  try {
    const res = await holidayApi.getHolidays();

    const sorted = res.data.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setHolidays(sorted);
  } catch (err) {
    console.error(err);
  }
};



  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.name || !form.date) {
      toast.error("Name and Date are required");
      return;
    }

    try {
      await holidayApi.createHoliday(form);
      toast.success("Holiday created");

      setForm({
        name: "",
        date: "",
      });

      fetchHolidays();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create holiday");
    }
  };

  const handleDelete = async (id: number) => {
  try {
    await holidayApi.deleteHoliday(id);
    toast.success("Holiday deleted");

    setDeleteModal(null);

    fetchHolidays();
  } catch (err) {
    console.error(err);
  }
};

const today = new Date();
today.setHours(0,0,0,0);

const filteredHolidays = holidays
  .filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Holiday Management
      </h1>

      <div className="flex justify-between mb-6">

  <input
    placeholder="Search holiday..."
    className="border p-2 rounded w-[250px]"
    onChange={(e) => setSearch(e.target.value)}
  />

</div>

      {/* Create Holiday Form */}

      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">

        <input
          type="text"
          name="name"
          placeholder="Holiday Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded w-48"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Holiday
        </button>

      </form>

      {/* Holiday Table */}

      <table className="w-full border">

        
         <thead>
  <tr className="bg-gray-100">

    <th className="p-3 border">Holiday</th>
    <th className="p-3 border">Date</th>
    <th className="p-3 border">Status</th>
    <th className="p-3 border">Action</th>

  </tr>
</thead>
        

       <tbody>
  {filteredHolidays.map((h) => {

    const holidayDate = new Date(h.date);
    holidayDate.setHours(0,0,0,0);

    let badge = "bg-gray-100 text-gray-600";
    let label = "Past";

    if (holidayDate.getTime() === today.getTime()) {
      badge = "bg-blue-100 text-blue-600";
      label = "Today";
    } 
    else if (holidayDate > today) {
      badge = "bg-green-100 text-green-600";
      label = "Upcoming";
    }

    return (

      <tr key={h.id} className="hover:bg-gray-50">

        <td className="p-3 border font-medium">
          {h.name}
        </td>

        <td className="p-3 border">
          {holidayDate.toLocaleDateString()}
        </td>

        <td className="p-3 border">

          <span className={`px-2 py-1 rounded text-xs ${badge}`}>
            {label}
          </span>

        </td>

        <td className="p-3 border">

          <button
            onClick={() => setDeleteModal(h)}
            className="text-red-600 font-semibold"
          >
            Delete
          </button>

        </td>

      </tr>

    );

  })}
</tbody>

      </table>

      {deleteModal && (
  <DeleteHolidayModal
    holiday={deleteModal}
    close={() => setDeleteModal(null)}
    onDelete={handleDelete}
  />
)}
    </div>
  );
}