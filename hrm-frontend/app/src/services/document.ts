import api from "./api";

export const uploadDocument = async (id:number,data:any)=>{
  const res = await api.post(`/employees/${id}/documents`,data);
  return res.data;
};

export const getDocuments = async (id:number)=>{
  const res = await api.get(`/employees/${id}/documents`);
  return res.data;
};

export const deleteDocument = async (id:number)=>{
  const res = await api.delete(`/employees/documents/${id}`);
  return res.data;
};