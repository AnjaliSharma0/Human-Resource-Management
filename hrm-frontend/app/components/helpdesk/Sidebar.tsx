// 'use client';

// import { useState } from 'react';

// export default function Sidebar({ tickets, onSelect }: any) {
//   const [search, setSearch] = useState('');

//   const filtered = tickets.filter((t: any) =>
//     t.subject.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="w-[320px] border-r bg-white p-4 flex flex-col">

//       <h2 className="text-xl font-bold mb-4">Tickets</h2>

//       {/* 🔍 Search */}
//       <input
//         placeholder="Search..."
//         className="border p-2 rounded mb-4"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* 📋 Ticket List */}
//       <div className="flex-1 overflow-y-auto space-y-2">
//         {filtered.map((t: any) => (
//           <div
//             key={t.id}
//             onClick={() => onSelect(t)}
//             className="p-3 border rounded cursor-pointer hover:bg-gray-100"
//           >
//             <div className="font-semibold">{t.subject}</div>

//             <div className="text-xs text-gray-500 flex justify-between">
//               <span>{t.status}</span>
//               <span>#{t.id}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';

export default function Sidebar({ tickets, onSelect, onCreate }: any) {
  const [search, setSearch] = useState('');

  const filtered = tickets.filter((t: any) =>
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[320px] border-r bg-white p-4 flex flex-col">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tickets</h2>

        <button
          onClick={onCreate}
          className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
        >
          + New
        </button>
      </div>

      {/* 🔍 Search */}
            <input
          placeholder="Search..."
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      {/* 📋 Tickets */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.map((t: any) => (
          <div
            key={t.id}
            onClick={() => onSelect(t)}
            className="p-3 border rounded w-full px-4 py-2 mb-4 border border-gray-300 rounded-xl shadow-sm 
                    focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer hover:bg-gray-200"
          >
            <div className="font-semibold">{t.subject}</div>

            <div className="text-xs text-gray-500 flex justify-between">
              <span>{t.status}</span>
              <span>#{t.id}</span>
            </div>
                        
            {/* 🔥 show user */}
            {t.user && (
              <div className="text-xs text-gray-400">
                {t.user.name}
              </div>
            )}
          </div>
        ))}
      </div>

      
    </div>
  );
}