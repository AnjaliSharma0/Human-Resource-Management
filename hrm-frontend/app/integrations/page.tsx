"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { integrationApi } from "../src/services/integrationApi";
import IntegrationCard from "../components/Integration";

export default function IntegrationsPage() {
  const [status, setStatus] = useState<any>({});

  const fetchStatus = async () => {
    const res = await integrationApi.getStatus();
    setStatus(res.data);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      
      <IntegrationCard
        title="Slack"
        status={status.slack}
        actionLabel="Connect"
        onAction={() => {
          window.location.href = "http://localhost:3000/integrations/slack/auth";
        }}
      />

      <IntegrationCard
        title="Payroll (Bank)"
        status={true}
        actionLabel="Run Payroll"
        onAction={async () => {
          await integrationApi.payrollSync();
          toast.success("Payroll processed");
        }}
      />

      <IntegrationCard
        title="EPFO Export"
        status={true}
        actionLabel="Generate File"
        onAction={async () => {
          const res = await integrationApi.epfoExport();
          toast.success(res.data.message);
        }}
      />

      <IntegrationCard
        title="LMS Sync"
        status={status.lms}
        actionLabel="Sync"
        onAction={async () => {
          await integrationApi.lmsSync();
          toast.success("LMS Synced");
        }}
      />

    </div>
  );
}