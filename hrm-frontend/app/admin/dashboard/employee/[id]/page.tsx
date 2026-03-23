// "use client";

// import ContactsTab from "@/app/components/profileTabs/ContactTab";
// import DocumentsTab from "@/app/components/profileTabs/DocumentTab";
// import HistoryTab from "@/app/components/profileTabs/HistoryTab";
// import ProfileTab from "@/app/components/profileTabs/ProfileTab";
// import { useParams } from "next/navigation";
// import { useState } from "react";



// export default function EmployeeProfile(){

//   const params = useParams();
// const [tab,setTab] = useState("profile");
// const employeeId = Array.isArray(params?.id) ? params.id[0] : params?.id;


//   if (!employeeId) return <p>Loading employee...</p>; // avoid undefined


// return(

// <div className="bg-white p-6 rounded-xl shadow">

// <h2 className="text-2xl font-bold mb-6">
// Employee Profile
// </h2>

// {/* TABS */}

// <div className="flex gap-6 border-b mb-6">

// <button onClick={()=>setTab("profile")}>Profile</button>

// <button onClick={()=>setTab("documents")}>Documents</button>

// <button onClick={()=>setTab("contacts")}>Emergency Contacts</button>

// <button onClick={()=>setTab("history")}>History</button>

// </div>

// {/* TAB CONTENT */}

// {tab==="profile" && <ProfileTab employeeId ={employeeId} userRole="admin"/>}

// {/* {tab==="documents" && <DocumentsTab/>} */}
// {tab === "documents" && <DocumentsTab employeeId={employeeId} />}

// {tab==="contacts" && <ContactsTab employeeId={employeeId}/>}

// {tab==="history" && <HistoryTab employeeId={employeeId} userRole="admin"/>}

// </div>

// )
// }

"use client";

import ContactsTab from "@/app/components/profileTabs/ContactTab";
import DocumentsTab from "@/app/components/profileTabs/DocumentTab";
import HistoryTab from "@/app/components/profileTabs/HistoryTab";
import ProfileTab from "@/app/components/profileTabs/ProfileTab";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EmployeeProfile() {
  const params = useParams();
  const [tab, setTab] = useState("profile");
  const employeeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!employeeId) return <p className="p-4">Loading employee...</p>;

  return (
    <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-md max-w-6xl mx-auto">

      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Employee Profile
      </h2>

      {/* 🔥 Responsive Tabs */}
      <div className="w-full mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex sm:flex-wrap gap-2 border-b pb-2 w-max sm:w-full">
            
            {[
              { key: "profile", label: "Profile" },
              { key: "documents", label: "Documents" },
              { key: "contacts", label: "Emergency Contacts" },
              { key: "history", label: "History" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`
                  px-4 py-2 text-xs sm:text-sm rounded-lg whitespace-nowrap
                  transition-all duration-200 flex-shrink-0
                  
                  ${
                    tab === item.key
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:scale-95"
                  }
                `}
              >
                {item.label}
              </button>
            ))}

          </div>
        </div>
      </div>

      {/* 🔽 Content Area */}
      <div className="bg-gray-50 rounded-xl p-3 sm:p-5 min-h-[300px] transition-all duration-300">

        {tab === "profile" && (
          <ProfileTab employeeId={employeeId} userRole="admin" />
        )}

        {tab === "documents" && (
          <DocumentsTab employeeId={employeeId} />
        )}

        {tab === "contacts" && (
          <ContactsTab employeeId={employeeId} />
        )}

        {tab === "history" && (
          <HistoryTab employeeId={employeeId} userRole="admin" />
        )}

      </div>
    </div>
  );
}