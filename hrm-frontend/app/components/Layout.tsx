"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


export default function Layout({children}:any){

return(

   <div className="flex min-h-screen bg-gray-100 relative">

<Sidebar/>

      <div className="flex flex-col flex-1 md:ml-20 lg:ml-64 transition-all duration-300">

<Navbar/>

  <div className="p-4 sm:p-6 md:p-8">

{children}

</div>

</div>

</div>

)
}