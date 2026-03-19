import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/org', // change to your backend URL
});

// export const orgApi = {
//   getDepartments: () => api.get('/departments'),
//   createDepartment: (data: any) => api.post('/departments', data),

//   getLocations: () => api.get('/locations'),
//   createLocation: (data: any) => api.post('/locations', data),

//   getBusinessUnits: () => api.get('/business-units'),
//   createBusinessUnit: (data: any) => api.post('/business-units', data),

//   getHierarchy: () => api.get('/hierarchy'),
// };

export const orgApi = {
  // Departments
  getDepartments: () => api.get('/departments'),
  createDepartment: (data: any) => api.post('/departments', data),
  updateDepartment: (id: number, data: any) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id: number) => api.delete(`/departments/${id}`),

  // Locations
  getLocations: () => api.get('/locations'),
  createLocation: (data: any) => api.post('/locations', data),
  updateLocation: (id: number, data: any) => api.put(`/locations/${id}`, data),
  deleteLocation: (id: number) => api.delete(`/locations/${id}`),

  // Business Units
  getBusinessUnits: () => api.get('/business-units'),
  createBusinessUnit: (data: any) => api.post('/business-units', data),
  updateBusinessUnit: (id: number, data: any) => api.put(`/business-units/${id}`, data),
  deleteBusinessUnit: (id: number) => api.delete(`/business-units/${id}`),

  // Employee hierarchy
  getHierarchy: () => api.get('/hierarchy'),
};