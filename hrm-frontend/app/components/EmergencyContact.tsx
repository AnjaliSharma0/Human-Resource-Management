"use client";

import { useEffect,useState } from "react";
import { getEmergencyContacts } from "../src/services/emergency";


export default function EmergencyContacts({id}:any){

const [contacts,setContacts]=useState<any[]>([]);

useEffect(()=>{

const load=async()=>{
const data=await getEmergencyContacts(id);
setContacts(data);
};

load();

},[]);

return(

<div className="bg-white p-5 rounded-xl shadow mt-5">

<h3 className="font-bold mb-3">
Emergency Contacts
</h3>

{contacts.map(c=>(
<div key={c.id} className="border-b py-2">

<p>{c.name}</p>
<p className="text-gray-500">{c.phone}</p>

</div>
))}

</div>

);
}