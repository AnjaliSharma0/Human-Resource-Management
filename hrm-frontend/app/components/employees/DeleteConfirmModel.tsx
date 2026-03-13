"use client";

import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteEmployeeModal({employee,close,onDelete}:any){

return(

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

<div className="bg-white rounded-xl p-6 w-[350px] text-center">

<DeleteIcon className="text-red-500 text-5xl mb-3"/>

<h2 className="text-lg font-semibold mb-2">
Delete Employee
</h2>

<p className="text-gray-500 mb-4">
Are you sure you want to delete <b>{employee.firstName}</b>?
</p>

<div className="flex justify-center gap-4">

<button
onClick={close}
className="px-4 py-2 border rounded-lg"
>
Cancel
</button>

<button
onClick={()=>onDelete(employee.id)}
className="px-4 py-2 bg-red-600 text-white rounded-lg"
>
Delete
</button>

</div>

</div>

</div>

);

}