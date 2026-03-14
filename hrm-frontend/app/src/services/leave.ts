import api from "./api";


export const leaveApi = {
  applyLeave: (data: any) => api.post('/leave', data),
  getEmployeeLeaves: (id: number) => api.get(`/leave/employee/${id}`),
  getAllLeaves: () => api.get('/leave'),
  updateLeaveStatus: (id: number, status: 'Approved'|'Rejected') => api.put(`/leave/${id}/status`, { status }),
  getLeaveCalendar: () => api.get('/leave/calendar'),
  getHoliday:()=> api.get("/holiday"),
  getLeaveBalance(employeeId: number) {
  return api.get(`/leave/employee/${employeeId}`);
}
};