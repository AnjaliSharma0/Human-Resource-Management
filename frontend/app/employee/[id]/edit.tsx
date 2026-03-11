"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  MenuItem,
  ListItem,
  IconButton,
  Link as MuiLink,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api, { setAuthToken } from "@/app/utils/api";

// --- Type Definitions ---
interface EmergencyContact {
  id?: number;
  name: string;
  relationship: string;
  phone: string;
}

interface Document {
  id?: number;
  documentName: string;
  filePath: string;
  file?: File;
}

interface History {
  id?: number;
  companyName: string;
  designation: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Department {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  title: string;
}

interface EmployeeProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  joiningDate: string;
  status: string;
  department: Department | null;
  designation: Designation | null;
  manager: { id: number; firstName: string; lastName: string } | null;
  emergencyContacts: EmergencyContact[];
  documents: Document[];
  history: History[];
}

export default function EmployeeEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const userRole = localStorage.getItem("role");

  // --- Fetch Data ---
  useEffect(() => {
    if (!id) return;
    setAuthToken(token);

    const fetchData = async () => {
      try {
        const [empRes, deptRes, desigRes] = await Promise.all([
          api.get<EmployeeProfile>(`/employees/${id}/profile`),
          api.get<Department[]>(`/departments`),
          api.get<Designation[]>(`/designations`)
        ]);
        setEmployee(empRes.data);
        setDepartments(deptRes.data);
        setDesignations(desigRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (!id) return <Typography>Invalid Employee ID</Typography>;
  if (loading) return <Box className="flex justify-center mt-20"><CircularProgress /></Box>;
  if (!employee) return <Box className="text-center mt-20">Employee not found</Box>;

  // --- Access Control ---
  const canEdit = userRole === "admin" || employee.id === userId;
  if (!canEdit) return <Box className="text-center mt-20">You are not allowed to edit this profile</Box>;

  // --- Handlers ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleDepartmentChange = (e: any) => {
    const dept = departments.find(d => d.id === Number(e.target.value));
    setEmployee(prev => prev ? { ...prev, department: dept! } : prev);
  };

  const handleDesignationChange = (e: any) => {
    const desig = designations.find(d => d.id === Number(e.target.value));
    setEmployee(prev => prev ? { ...prev, designation: desig! } : prev);
  };

  const handleSave = async () => {
    if (!employee) return;
    setSaving(true);
    try {
      await api.patch(`/employees/${employee.id}`, {
        firstName: employee.firstName,
        lastName: employee.lastName,
        phone: employee.phone,
        address: employee.address,
        departmentId: employee.department?.id,
        designationId: employee.designation?.id
      });
      alert("Employee updated successfully");
      router.refresh(); // refresh page after save
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  // --- Emergency Contacts ---
  const addContact = () => setEmployee(prev => prev ? { ...prev, emergencyContacts: [...prev.emergencyContacts, { name: "", relationship: "", phone: "" }] } : prev);
  const updateContact = (idx: number, field: string, value: string) => {
    setEmployee(prev => {
      if (!prev) return prev;
      const updated = [...prev.emergencyContacts];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, emergencyContacts: updated };
    });
  };
  const removeContact = (idx: number) => {
    setEmployee(prev => {
      if (!prev) return prev;
      const updated = prev.emergencyContacts.filter((_, i) => i !== idx);
      return { ...prev, emergencyContacts: updated };
    });
  };

  // --- Documents ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employee) return;
    setEmployee({ ...employee, documents: [...employee.documents, { documentName: file.name, filePath: "", file }] });
  };

  const uploadDocuments = async () => {
    if (!employee) return;
    setUploading(true);
    try {
      for (const doc of employee.documents) {
        if (doc.file) {
          const formData = new FormData();
          formData.append("file", doc.file);
          await api.post(`/employees/${employee.id}/documents`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        }
      }
      alert("Documents uploaded");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --- Work History ---
  const addHistory = () => setEmployee(prev => prev ? { ...prev, history: [...prev.history, { companyName: "", designation: "", startDate: "", endDate: "", description: "" }] } : prev);
  const updateHistory = (idx: number, field: string, value: string) => {
    setEmployee(prev => {
      if (!prev) return prev;
      const updated = [...prev.history];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, history: updated };
    });
  };
  const removeHistory = (idx: number) => {
    setEmployee(prev => {
      if (!prev) return prev;
      const updated = prev.history.filter((_, i) => i !== idx);
      return { ...prev, history: updated };
    });
  };

  // --- JSX ---
  return (
    <Box className="max-w-5xl mx-auto p-6 space-y-6">
      <Typography variant="h5">Edit Employee Profile</Typography>

      {/* Personal Info */}
      <Card className="p-4 space-y-4">
        <TextField label="First Name" name="firstName" value={employee.firstName} onChange={handleChange} fullWidth />
        <TextField label="Last Name" name="lastName" value={employee.lastName} onChange={handleChange} fullWidth />
        <TextField label="Phone" name="phone" value={employee.phone} onChange={handleChange} fullWidth />
        <TextField label="Address" name="address" value={employee.address} onChange={handleChange} fullWidth />
      </Card>

      {/* Department & Designation */}
      <Card className="p-4 space-y-4">
        <TextField select label="Department" value={employee.department?.id || ""} onChange={handleDepartmentChange} fullWidth>
          {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
        </TextField>
        <TextField select label="Designation" value={employee.designation?.id || ""} onChange={handleDesignationChange} fullWidth>
          {designations.map(d => <MenuItem key={d.id} value={d.id}>{d.title}</MenuItem>)}
        </TextField>
      </Card>

      {/* Emergency Contacts */}
      <Card className="p-4 space-y-4">
        <Typography variant="h6">Emergency Contacts</Typography>
        {employee.emergencyContacts.map((c, idx) => (
          <Box key={idx} className="flex gap-2 items-center">
            <TextField label="Name" value={c.name} onChange={e => updateContact(idx, "name", e.target.value)} />
            <TextField label="Relationship" value={c.relationship} onChange={e => updateContact(idx, "relationship", e.target.value)} />
            <TextField label="Phone" value={c.phone} onChange={e => updateContact(idx, "phone", e.target.value)} />
            <IconButton onClick={() => removeContact(idx)}><DeleteIcon /></IconButton>
          </Box>
        ))}
        <Button onClick={addContact}>Add Contact</Button>
      </Card>

      {/* Documents */}
      <Card className="p-4 space-y-4">
        <Typography variant="h6">Documents</Typography>
        {employee.documents.map((d, idx) => (
          <ListItem key={idx} className="flex justify-between items-center">
            {d.filePath ? (
              <MuiLink href={`http://localhost:5000/${d.filePath}`} target="_blank">{d.documentName}</MuiLink>
            ) : (
              <span>{d.documentName}</span>
            )}
            <IconButton onClick={() => setEmployee(prev => prev ? { ...prev, documents: prev.documents.filter((_, i) => i !== idx) } : prev)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
        <input type="file" onChange={handleFileChange} />
        <Button onClick={uploadDocuments} disabled={uploading}>{uploading ? "Uploading..." : "Upload Documents"}</Button>
      </Card>

      {/* Work History */}
      <Card className="p-4 space-y-4">
        <Typography variant="h6">Work History</Typography>
        {employee.history.map((h, idx) => (
          <Box key={idx} className="flex gap-2 items-center">
            <TextField label="Company" value={h.companyName} onChange={e => updateHistory(idx, "companyName", e.target.value)} />
            <TextField label="Designation" value={h.designation} onChange={e => updateHistory(idx, "designation", e.target.value)} />
            <TextField type="date" label="Start Date" value={h.startDate.split("T")[0]} onChange={e => updateHistory(idx, "startDate", e.target.value)} />
            <TextField type="date" label="End Date" value={h.endDate.split("T")[0]} onChange={e => updateHistory(idx, "endDate", e.target.value)} />
            <TextField label="Description" value={h.description} onChange={e => updateHistory(idx, "description", e.target.value)} />
            <IconButton onClick={() => removeHistory(idx)}><DeleteIcon /></IconButton>
          </Box>
        ))}
        <Button onClick={addHistory}>Add Work History</Button>
      </Card>

      {/* Save Button */}
      <Box className="flex justify-end">
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}