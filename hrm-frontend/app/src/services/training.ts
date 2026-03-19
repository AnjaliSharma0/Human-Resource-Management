import api from "./api";


// ==================== COURSES ====================

// Create Course (Admin)
export const createCourse = async (data: any) => {
  const res = await api.post("/admin/training/courses", data);
  return res.data;
};

// Get All Courses
export const getCourses = async () => {
  const res = await api.get("/training/courses");
  return res.data;
};


// ==================== ENROLLMENT ====================

// Enroll Employee (Admin - general)
export const enrollEmployee = async (data: { employeeId: number; courseId: number }) => {
  const res = await api.post("/training/enroll", data);
  return res.data;
};

// Enroll Employee (Employee side - optional flow)
export const enrollSelf = async (employeeId: number, data: any) => {
  const res = await api.post(`/employee/training/enroll/${employeeId}`, data);
  return res.data;
};

// Get ALL enrollments (Admin)
export const getAllEnrollments = async () => {
  const res = await api.get("/admin/training/enrollments");
  return res.data;
};

// Get Employee Courses
export const getMyCourses = async (employeeId: number) => {
  const res = await api.get(`/employee/training/my-courses/${employeeId}`);
  return res.data;
};


// ==================== FEEDBACK ====================

// Submit Feedback (Employee)
export const submitFeedback = async (data: { enrollmentId: number; feedback: string }) => {
  const res = await api.post("/employee/training/feedback", data);
  return res.data;
};


// ==================== SKILL MATRIX ====================

// Get ALL employees skill matrix (Admin)
export const getAllSkills = async () => {
  const res = await api.get("/admin/skills/matrix");
  return res.data;
};

// Get single employee skills
export const getEmployeeSkills = async (employeeId: number) => {
  const res = await api.get(`/admin/skills/employee/${employeeId}`);
  return res.data;
};