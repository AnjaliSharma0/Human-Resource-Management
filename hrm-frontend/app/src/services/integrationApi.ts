import api from "@/app/src/services/api";

export const integrationApi = {
  getStatus: () => api.get("/integrations/status"),
  slackConnect: () => window.open("/api/integrations/slack/auth"),
  payrollSync: () => api.post("/integrations/payroll/sync"),
  epfoExport: () => api.post("/integrations/epfo/export"),
  lmsSync: () => api.post("/integrations/lms/sync"),
};
