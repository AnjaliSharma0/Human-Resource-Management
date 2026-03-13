import api from "./api";

export const addHistory = async (id:number,data:any)=>{
  const res = await api.post(`/employees/${id}/history`,data);
  return res.data;
};

export const getHistory = async (id:number)=>{
  const res = await api.get(`/employees/${id}/history`);
  return res.data;
};

export const deleteHistory = async (id:number)=>{
  const res = await api.delete(`/employees/history/${id}`);
  return res.data;
};