import Image from "next/image";
import RegisterPage from "./auth/register/page";
import AuthProvider from "./context/AuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HRM System",
  description: "Everthing in one go...",
};

export default function Home() {
  return (
    <div>
      <main>
        <AuthProvider>
         <RegisterPage/>
        </AuthProvider>
   
      </main>
    </div>
  );
}
