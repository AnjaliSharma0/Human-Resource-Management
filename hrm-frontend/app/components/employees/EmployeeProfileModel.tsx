"use client";

import CloseIcon from "@mui/icons-material/Close";

export default function EmployeeProfileModal({employee,close}:any){

return(

<div className="fixed inset-0 bg-black/40 flex justify-center items-center">

<div className="bg-white w-[400px] rounded-xl p-6 relative">

<button
onClick={close}
className="absolute right-3 top-3"
>
<CloseIcon/>
</button>

<div className="flex flex-col items-center">

<img
src={`https://i.pravatar.cc/150?img=${employee.id}`}
className="w-24 h-24 rounded-full mb-3"
/>

<h2 className="text-xl font-bold">
{employee.firstName} {employee.lastName}
</h2>

<p className="text-gray-500">
{employee.email}
</p>

<div className="mt-4 text-sm w-full space-y-2">

<p><b>Phone:</b> {employee.phone}</p>

<p><b>Gender:</b> {employee.gender}</p>

<p><b>Address:</b> {employee.address}</p>

<p><b>Status:</b> {employee.status}</p>

</div>

</div>

</div>

</div>

);

}