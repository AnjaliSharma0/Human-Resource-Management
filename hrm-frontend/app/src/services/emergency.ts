import api from "./api";

export const addEmergencyContact = async (id:number,data:any)=>{
  const res = await api.post(`/employees/${id}/emergency-contacts`,data);
  return res.data;
};

export const getEmergencyContacts = async (id:number)=>{
  const res = await api.get(`/employees/${id}/emergency-contacts`);
  return res.data;
};

export const deleteEmergencyContact = async (id:number)=>{
  const res = await api.delete(`/employees/emergency-contacts/${id}`);
  return res.data;
};