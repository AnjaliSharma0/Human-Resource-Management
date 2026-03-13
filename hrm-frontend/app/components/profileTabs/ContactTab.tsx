"use client";

import api from "@/app/src/services/api";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import AddContactModal from "./AddContactForm";

export default function ContactsTab({ employeeId }: any) {

  const [contacts,setContacts] = useState<any[]>([]);
 const [showModal,setShowModal] = useState(false);
  const loadContacts = async () => {
    try {

      const res = await api.get(`/employees/${employeeId}/emergency-contacts`);
      setContacts(res.data);

    } catch {
      toast.error("Failed to load contacts");
    }
  };

  useEffect(()=>{
    loadContacts();
  },[]);

  const deleteContact = async (id:number) => {

    await api.delete(`/employees/emergency-contacts/${id}`);

    toast.success("Contact deleted");

    loadContacts();
  };

  return (

    <div>

      <h3 className="font-semibold mb-4">
        Emergency Contacts
      </h3>

      {contacts.map(contact => (

        <div
          key={contact.id}
          className="border p-3 rounded mb-3 flex justify-between"
        >

          <div>
            <p className="font-semibold">{contact.name}</p>
            <p className="text-gray-500">{contact.phone}</p>
          </div>

          <button
            onClick={()=>deleteContact(contact.id)}
            className=" text-white bg-red-500 p-2 m-2 rounded-lg"
          >
            Delete
          </button>

        </div>
        

      ))}
<button
onClick={()=>setShowModal(true)}
className="bg-indigo-600 text-white px-3 py-1 rounded mb-4"
>
Add Contact
</button>

{showModal && (
<AddContactModal
employeeId={employeeId}
close={()=>setShowModal(false)}
reload={loadContacts}
/>
)}
    </div>
  );
}