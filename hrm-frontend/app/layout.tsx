"use client"
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  const pathname = usePathname();

  // pages where you DON'T want the sidebar
  const noSidebarRoutes = ["/","/auth/login", "/auth/register"];

  const showSidebar = !noSidebarRoutes.includes(pathname); 

  return (
    <html lang="en">
      <body>
        {showSidebar? (
           <Layout>
           {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        </Layout>
        ):(
        <div className="min-h-screen">{children}</div>
      )}
      </body>
    </html>
  );
}



  

  // return (
  //   <>
  //     {showSidebar ? (
  //       <EmployeesLayout>{children}</EmployeesLayout>
  //     ) : (
  //       <div className="min-h-screen bg-gray-100">{children}</div>
  //     )}
  //   </>
  // );
//}