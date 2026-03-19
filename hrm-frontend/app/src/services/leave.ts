
import api from "./api";

export const leaveApi = {
  // Employee: Apply leave (employeeId inferred from JWT)
  applyLeave: (data: any) => api.post('/leave', data),

  // Employee: Get own leaves
  getEmployeeLeaves: (employeeId: number) =>
    api.get(`/leave/employee/${employeeId}`),

    getMyLeaves: () => api.get("/leave/employee/me"),
  // Admin: Get all leaves
  getAllLeaves: () => api.get('/leave'),

  // Admin: Update leave status
  updateLeaveStatus: (id: number, status: 'approved'|'rejected') =>
    api.put(`/leave/${id}/status`, { status }),

  // Leave calendar
  getLeaveCalendar: () => api.get('/leave/calendar'),

  // Holidays
  getHoliday: () => api.get('/holiday'),

  getLeaveTypes:() => api.get('/leave-types'),
  createLeaveType:(p0: { daysPerYear: number; name: string; description: string; })=> api.post("/leave-types"),
  getEmployees:()=> api.get('/employees'),

  // // Employee: Get own leave balance
  // getLeaveBalance: () => api.get('/leave/me/balance'),
  
createLeaveBalance: (data:any)=>
  api.post("/leave/balance", data),


getEmployeeBalance: (employeeId:number)=>
  api.get(`/leave/balance/${employeeId}`)
  
};



export const holidayApi = {
  getHolidays: () => api.get("/holiday"),
  createHoliday: (data: { name: string; date: string }) =>
    api.post("/holiday", data),
  deleteHoliday: (id: number) => api.delete(`/holiday/${id}`),
};


