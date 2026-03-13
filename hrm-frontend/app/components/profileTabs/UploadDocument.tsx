"use client";

import api from "@/app/src/services/api";
import { useState } from "react";

import toast from "react-hot-toast";

export default function UploadDocumentModal({ employeeId, close, reload }: any){

const [file,setFile] = useState<any>(null);

const upload = async ()=>{

const formData = new FormData();

formData.append("file",file);

try{

await api.post(`/employees/${employeeId}/documents`,formData);

toast.success("Document uploaded");

reload();
close();

}catch{

toast.error("Upload failed");

}

};

return(

<div className="fixed inset-0 flex items-center justify-center bg-black/40">

<div className="bg-white p-6 rounded-xl w-[400px]">
<div>
<h2 className="text-xl font-bold mb-4">
Upload Document
</h2>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0])}
/>

</div>
<div className="flex gap-3 mt-4">

<button
onClick={upload}
className="bg-indigo-600 text-white px-4 py-2 rounded"
>
Upload
</button>

<button
onClick={close}
className="bg-gray-300 px-4 py-2 rounded"
>
Cancel
</button>

</div>

</div>

</div>

);
}