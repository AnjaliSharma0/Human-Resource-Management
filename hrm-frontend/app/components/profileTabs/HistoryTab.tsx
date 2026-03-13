

"use client";

import api from "@/app/src/services/api";
import { useEffect, useState } from "react";
import AddHistoryModal from "./AddHistoryModel";

interface HistoryTabProps {
  employeeId: string;
  userRole: "admin" | "manager" | "employee";
}

export default function HistoryTab({ employeeId, userRole }: HistoryTabProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await api.get(`/employees/${employeeId}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [employeeId]);

  const deleteHistory = async (id: number) => {
    try {
      await api.delete(`/employees/history/${id}`);
      loadHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = userRole === "employee"; // only employee can delete

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h3 className="font-semibold text-lg">Employment History</h3>
        {canEdit && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500">No employment history found.</p>
      ) : (
        <div className="flex flex-wrap">
          {history.map((item) => (
            <div
              key={item.id}
              className="border-gray-300 max-w-sm bg-white rounded-xl shadow-lg py-4 px-5 m-4 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {item.companyName}
                </h3>
                <p className="text-gray-600 mb-1">{item.designation}</p>
                <p className="text-gray-500 text-sm mb-1">{item.description}</p>
                <p className="text-gray-400 text-sm">
                  {item.startDate} - {item.endDate}
                </p>
              </div>

              {canEdit && (
                <button
                  onClick={() => deleteHistory(item.id)}
                  className="mt-3 text-white bg-red-500 p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddHistoryModal
          employeeId={employeeId}
          close={() => setShowModal(false)}
          reload={loadHistory}
        />
      )}
    </div>
  );
}