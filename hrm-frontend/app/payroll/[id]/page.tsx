"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { getPayroll } from "@/app/src/services/payroll";
import PayslipCard from "@/app/components/payroll/PayrollCard";

export default function PayrollDetailsPage() {

  const { id } = useParams();
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getPayroll(Number(id), token!);
    setData(res);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">

      <PayslipCard payroll={data} />

    </div>
  );
}